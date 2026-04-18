
import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode, toNano } from '@ton/core';
import { compile } from '@ton/blueprint';

export type NafasTokenConfig = {
  owner: Address;
  minter: Address;
  name: string;
  symbol: string;
  decimals: number;
};

export function nafasTokenConfigToCell(config: NafasTokenConfig): Cell {
  return beginCell()
    .storeAddress(config.owner)
    .storeAddress(config.minter)
    .storeStringTail(config.name)
    .storeStringTail(config.symbol)
    .storeUint(config.decimals, 8)
    .endCell();
}

export class NafasToken implements Contract {
  static createFromConfig(config: NafasTokenConfig, code: Cell, workchain = 0) {
    const data = nafasTokenConfigToCell(config);
    const init = { code, data };
    return new NafasToken(contractAddress(workchain, init), init);
  }

  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendMint(provider: ContractProvider, via: Sender, to: Address, amount: bigint) {
    const body = beginCell()
      .storeUint(0x178d4519, 32) // mint op
      .storeUint(0, 64)
      .storeAddress(to)
      .storeCoins(amount)
      .endCell();

    await provider.internal(via, {
      value: toNano('0.05'),
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    });
  }
}

