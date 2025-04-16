// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

// Simplified version
contract SimpleOFT is ERC20, Ownable {
    address public lzEndpoint;
    
    // Event to emit when tokens are bridged to another chain
    event Bridged(address indexed user, uint256 amount, uint16 dstChainId);
    
    // Chain configuration constants for Ethereum and Base (Layer Zero testnet IDs)
    uint16 public constant ETHEREUM_CHAIN_ID = 1;
    uint16 public constant BASE_CHAIN_ID = 184;
    
    constructor(string memory name, string memory symbol, address _lzEndpoint) 
        ERC20(name, symbol) 
        Ownable(msg.sender)
    {
        require(_lzEndpoint != address(0), "LZ endpoint cannot be zero address");
        lzEndpoint = _lzEndpoint;
    }
    
    /**
     * @dev Updates the LayerZero endpoint address
     * @param _newEndpoint The new endpoint address
     */
    function setLzEndpoint(address _newEndpoint) external onlyOwner {
        require(_newEndpoint != address(0), "LZ endpoint cannot be zero address");
        lzEndpoint = _newEndpoint;
    }
    
    /**
     * @dev Allows users to mint tokens to themselves (for testing)
     * @param amount The amount of tokens to mint
     */
    function mint(uint256 amount) external {
        _mint(msg.sender, amount);
    }
    
    function bridgeTokens(uint256 amount, uint16 dstChainId) external {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // In a real implementation, this would call the LayerZero endpoint
        // For this test, we simpli burn tokens and emit the event
        _burn(msg.sender, amount);
        
        emit Bridged(msg.sender, amount, dstChainId);
    }
}