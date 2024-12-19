// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./LuckyToken.sol"; // Import the ERC-20 LuckyToken

/// @title TokenHandler contract to track user (stashes) and game (kitty) accounts
/// @author Groups 1, 6
/// @dev This contract interacts with the LuckyToken transfer tokens between the token contract and stashes and the kitty. Each game has its own TokenHandler
contract TokenHandler {
    LuckyToken public token; // ERC-20 token address
    address public ownerAddress;
    address public masterAccountAddress;
    // stashBalances + kittyBalance should equal 
    // Track stash balances for each user address
    mapping(address => uint256) private stashBalances;
    // Track this game's kitty balance
    uint256 private kittyBalance;

    // token address: 
    constructor(address _tokenAddress) {
        ownerAddress = msg.sender;
        token = LuckyToken(_tokenAddress);
        masterAccountAddress = _tokenAddress;
        kittyBalance = 0;
    }

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == ownerAddress, "Not the owner. Only owner may do this.");
        _;
    }

    // Move tokens from user's wallet to user's stash address(this)
    function depositWalletToStash(uint256 _numTokens) external {
        require(token.transferFrom(msg.sender, address(this), _numTokens), 
            string.concat(
                "Failed to deposit ", Strings.toString(_numTokens),
                " tokens from wallet to stash"
            )
        );
        stashBalances[msg.sender] += _numTokens;
    }

    // withdraw tokens from user's stash to user's wallet
    function withdrawStashToWallet(uint256 _numTokens) external {
        require(stashBalances[msg.sender] >= _numTokens,
            string.concat(
                "Insufficient token balance ", Strings.toString(stashBalances[msg.sender]),
                " in user stash to withdraw ", Strings.toString(_numTokens)
            )
        );
        stashBalances[msg.sender] -= _numTokens;
        require(token.transfer(msg.sender, _numTokens),
            string.concat(
                "Withdrawal to wallet of ", Strings.toString(_numTokens),
                " tokens failed"
            )
        );
    }

    // Move tokens from user's stash to game kitty
    function depositStashToGameKitty(uint256 _numTokens) external {
        require(stashBalances[msg.sender] >= _numTokens, "Insufficient balance in user stash");
        stashBalances[msg.sender] -= _numTokens;
        kittyBalance += _numTokens;
    }

    // Move tokens from game kitty to user's stash
    function withdrawGameKittyToStash(uint256 _numTokens) external {
        require(kittyBalance >= _numTokens, "Insufficient balance in game kitty to send to user stash");
        stashBalances[msg.sender] += _numTokens;
        kittyBalance -= _numTokens;
    }

    // transfer tokens from game kitty to Master Account
    function transferToMasterAccount(uint256 _numTokens) external onlyOwner {
        require(token.transferIn(address(this), _numTokens), "Transfer from kitty to master account failed");
        kittyBalance -= _numTokens;
    }

    // transfer tokens from Master Account to game kitty
    function transferFromMasterAccount(uint256 _numTokens) external onlyOwner {
        require(token.transferOut(address(this), _numTokens), "Transfer from master account to kitty failed");
        kittyBalance += _numTokens;
    }

    // Function for current user to send tokens to another address
    function sendTokens(address recipient, uint256 _numTokens) external {
        require(stashBalances[msg.sender] >= _numTokens, "Insufficient balance");
        require(token.transfer(recipient, _numTokens), "Transfer failed");
        stashBalances[msg.sender] -= _numTokens;
    }

    // Function to check this game's total balance (should be stashBalances + kittyBalance)
    function getGameBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    // Function to check an individual address's token balance in the contract
    function getStashBalance(address _userAddress) external view returns (uint256) {
        return stashBalances[_userAddress];
    }

    // Function to get this game's kitty balance
    function getGameKittyBalance() external view returns (uint256) {
        return kittyBalance;
    }

    // change the owner of this contract
    function changeOwner(address _newOwner) external onlyOwner {
        ownerAddress = _newOwner;
    }

    // get the address of the admin user this contract
    function getOwnerAddress() external view returns (address) {
        return ownerAddress;
    }
}
