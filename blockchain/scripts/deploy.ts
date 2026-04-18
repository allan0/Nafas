// ./blockchain/scripts/deploy.ts
import { toNano } from '@ton/ton';
import { NetworkProvider } from '@ton/blueprint';
import { NafasToken } from '../wrappers/NafasToken';

export async function run(provider: NetworkProvider) {
  const deployer = provider.sender();
  const ownerAddress = deployer.address!; // Your wallet as owner + initial minter

  console.log("Deploying NafasToken ($NAF) on TON...");

  const nafasToken = provider.open(await NafasToken.createFromConfig({
    owner: ownerAddress,
    minter: ownerAddress, // Backend wallet will get MINTER_ROLE later
    name: "Nafas Wellness",
    symbol: "NAF",
    decimals: 9,
  }));

  await nafasToken.sendDeploy(deployer, toNano('0.05'));

  console.log(`✅ NafasToken deployed at address: ${nafasToken.address.toString()}`);
  console.log(`Owner/Minter: ${ownerAddress.toString()}`);
  
  // Initial mint to owner (ecosystem fund)
  await nafasToken.sendMint(deployer, ownerAddress, toNano('10000000')); // 10M NAF
  console.log("✅ 10,000,000 $NAF minted to owner");
}

run;
