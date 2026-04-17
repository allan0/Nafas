// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NafasToken is ERC20, Ownable {
    constructor() ERC20("Nafas Wellness", "NAF") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10**decimals()); // Initial supply for the ecosystem
    }

    // Function to reward users for wellness activities
    function rewardUser(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // SocialFi: Tip a creator for their live stream
    function tipCreator(address creator, uint256 amount) public {
        _transfer(msg.sender, creator, amount);
    }
}
