contract NafasToken {
    owner: Address;
    minter: Address;
    name: String = "Nafas Wellness";
    symbol: String = "NAF";
    totalSupply: Int = 100000000 * 1000000000; // 100M with 9 decimals

    init(owner: Address, minter: Address) {
        self.owner = owner;
        self.minter = minter;
    }

    receive("mint", amount: Int, to: Address) {
        require(sender() == self.minter, "Only minter can mint");
        // Mint logic would go here in full implementation
        self.notify("Minted " + amount.toString() + " NAF to " + to.toString());
    }
}
