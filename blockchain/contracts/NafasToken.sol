// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title NafasToken ($NAF)
 * @dev Implementation of the Nafas Wellness SocialFi token.
 * Features: Role-based minting, Pausable transfers, and Tipping events.
 */
contract NafasToken is ERC20, ERC20Burnable, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Events for SocialFi tracking
    event WellnessRewardMinted(address indexed user, uint256 amount, string activityType);
    event CreatorTipped(address indexed sender, address indexed creator, uint256 amount, string memo);

    constructor(address defaultAdmin, address minter) ERC20("Nafas Wellness", "NAF") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, minter);
        _grantRole(PAUSER_ROLE, defaultAdmin);

        // Initial ecosystem supply (10 million NAF)
        _mint(defaultAdmin, 10_000_000 * 10 ** decimals());
    }

    /**
     * @dev Backend calls this to reward users for completing AI-recommended tasks.
     * Only addresses with MINTER_ROLE (the backend wallet) can call this.
     */
    function mintReward(
        address to, 
        uint256 amount, 
        string memory activityType
    ) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
        emit WellnessRewardMinted(to, amount, activityType);
    }

    /**
     * @dev SocialFi feature: Users tip wellness creators.
     * The memo allows the frontend to display a "Thank you" message.
     */
    function tipCreator(
        address creator, 
        uint256 amount, 
        string memory memo
    ) public whenNotPaused {
        require(balanceOf(msg.sender) >= amount, "NAF: Insufficient balance to tip");
        _transfer(msg.sender, creator, amount);
        emit CreatorTipped(msg.sender, creator, amount, memo);
    }

    /**
     * @dev Emergency pause mechanism
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // Required overrides for AccessControl and ERC20
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20)
        whenNotPaused
    {
        super._update(from, to, value);
    }
}
