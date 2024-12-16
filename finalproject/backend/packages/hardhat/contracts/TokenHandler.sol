// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./ILuckyToken.sol"; // Import the ERC-20 LuckyToken interface

/// @title TokenHandler contract to track user balances (stashes) and transfer tokens
/// @author Groups 1, 6
/// @dev This contract interacts with the LuckyToken using the ILuckyToken interface to transfer tokens to and from the contract and track the balance of each user
contract TokenHandler {
    ILuckyToken public token; // ERC-20 token address
    address public owner;
    address public masterAccountAddress;
    // Track stash balances for each user address
    mapping(address => uint256) public stashBalances;
    // Track game kitty balances for each game address
    mapping(address => uint256) public gameKittyBalances;

    event TokensReceived(address sender, uint256 _numTokens);
    event TokensSent(address recipient, uint256 _numTokens);

    // token address: 
    constructor(address _tokenAddress) {
        owner = msg.sender;
        token = ILuckyToken(_tokenAddress);
        masterAccountAddress = _masterAccountAddress;
    }

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner. Only owner may do this.");
        _;
    }

    // Move tokens from user's wallet to user's stash address(this)
    function depositWalletToStash(uint256 _numTokens) external {
        require(token.transferFrom(msg.sender, address(this), _numTokens), 
            string.concat(
                "Failed to deposit ", Strings.toString(_numTokens),
                "tokens from wallet to stash",
                Strings.toString(address(this))
            )
        );
        stashBalances[msg.sender] += _numTokens;
        emit TokensTransferred(msg.sender, address(this), _numTokens);
    }

    // withdraw tokens from user's stash to user's wallet
    function withdrawStashToWallet(uint256 _numTokens) external onlyOwner {
        require(stashBalances[msg.sender] >= _numTokens,
            string.concat(
                "Insufficient token balance ", Strings.toString(stashBalances[msg.sender]),
                "in user stash to withdraw", Strings.toString(_numTokens)
            )
        );
        stashBalances[msg.sender] -= _numTokens;
        require(token.transfer(msg.sender, _numTokens), "Withdrawal to wallet failed");
            string.concat(
                "Withdrawal to wallet of ", Strings.toString(_numTokens),
                "tokens failed"
            )
        );
    }

    // Move tokens from user's stash to game kitty
    function depositStashToGameKitty(uint256 _numTokens, address _gameAccount) external {
        require(stashBalances[msg.sender] >= _numTokens, "Insufficient balance in user stash");
        stashBalances[msg.sender] -= _numTokens;
        require(token.transfer(_gameAccount, _numTokens), "Transfer to kitty failed");
    }

    // Move tokens from game kitty to user's stash
    function withdrawGameKittyToStash(uint256 _numTokens, address _gameAccount) external {
        require(gameKittyBalances[_gameAccount] >= _numTokens, "Insufficient balance in game kitty to send to user stash");
        gameKittyBalances[_gameAccount] -= _numTokens;
        stashBalances[msg.sender] += _numTokens;
    }

    // transfer tokens from game kitty to Master Account
    function transferToMasterAccount(uint256 _numTokens, address _gameAccount) external {
        require(msg.sender == masterAccountAddress, "Only the House can transfer from game kitty to the master funds account");
        require(token.transferFrom(_gameAccount, masterAccountAddress, _numTokens), "Transfer failed");
    }

    // transfer tokens from Master Account to game kitty
    function transferToGameAccount(uint256 _numTokens, address _gameAccount) external {
        require(msg.sender == masterAccountAddress, "Only the House account can transfer from the master funds account to the game kitty");
        require(token.transferFrom(masterAccountAddress, _gameAccount, _numTokens), "Transfer failed");
    }

    // Function for current user to send tokens to another address
    function sendTokens(address recipient, uint256 _numTokens) external {
        require(stashBalances[msg.sender] >= _numTokens, "Insufficient balance");
        require(token.transfer(recipient, _numTokens), "Transfer failed");
        stashBalances[msg.sender] -= _numTokens;
        emit TokensSent(recipient, _numTokens);
    }

    // Function to check the contract's token balance
    function getContractBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    // Function to check an individual address's token balance in the contract
    function getStashBalance(address _userAddress) external view returns (uint256) {
        return stashBalances[_userAddress];
    }

    // Function to check the token balance of the specified game
    function getGameKittyBalance(address _gameAccount) external view returns (uint256) {
        return gameKittyBalances[_gameAccount];
    }

}
