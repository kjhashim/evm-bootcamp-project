// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract LuckyToken is ERC20, ERC20Permit, AccessControl {
    uint256 public faucetAmount; // # tokens dispensed per faucet request
    // wait period in seconds between faucet requests
    uint256 public faucetCooldown = 30*60; // 30 minutes

    address private _adminAddress;

    mapping(address => uint256) private _lastFaucetRequest;

    constructor( uint256 initialSupply, uint256 _faucetAmount) ERC20("LuckyToken", "LTK") ERC20Permit("LuckyToken") {
        // make contract deployer admin
        _adminAddress = msg.sender;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        // mint initial supply to this contract
        _mint(address(this), initialSupply);
        faucetAmount = _faucetAmount;
    }

    function mint(address to, uint256 amount) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _mint(to, amount);
    }

    // Function to transfer tokens into this contract
    function transferIn(address transferor, uint256 amount) public onlyRole(DEFAULT_ADMIN_ROLE) returns (bool) {
        require(amount > 0, "Amount must be greater than zero");
        _transfer(transferor, address(this), amount);
        return true;
    }

    // Function to transfer tokens out of this contract
    function transferOut(address transferee, uint256 amount) public onlyRole(DEFAULT_ADMIN_ROLE) returns (bool) {
        require(balanceOf(address(this)) >= amount, "Insufficient balance to transfer out");
        _transfer(address(this), transferee, amount);
        return true;
    }

    /// @dev Allows users to request tokens from the faucet.
    function requestTokens() external {
        require(block.timestamp >= _lastFaucetRequest[msg.sender] + faucetCooldown,
            string.concat(
                "Faucet cooldown still active. Please try again after ", 
                Strings.toString(_lastFaucetRequest[msg.sender] + faucetCooldown)
            )
        );
        require(balanceOf(address(this)) >= faucetAmount, "Insufficient faucet supply");

        _lastFaucetRequest[msg.sender] = block.timestamp;
        _transfer(address(this), msg.sender, faucetAmount);
    }

    // get this contract's token balance
    function getContractTokenBalance() external view returns (uint256) {
        return balanceOf(address(this));
    }

    // get the address of this contract
    function getContractAddress() external view returns (address) {
        return address(this);
    }

    // get the address of the admin user of this contract
    function getAdminAddress() external view returns (address) {
        return _adminAddress;
    }

    // Function to load the faucet with tokens (only admin can call this)
    function loadFaucet(uint256 amount) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(balanceOf(msg.sender) >= amount, 
            string.concat(
                "Insufficient balance to load faucet with ",
                Strings.toString(amount)
            )
        );
        _transfer(msg.sender, address(this), amount);
    }

    // Function to update faucet parameters (only admin can call this)
    function updateFaucetSettings(uint256 _faucetAmount, uint256 _faucetCooldown) public onlyRole(DEFAULT_ADMIN_ROLE) {
        faucetAmount = _faucetAmount * 10 ** decimals();
        faucetCooldown = _faucetCooldown;
    }

    /// @dev Returns the timestamp of the last faucet request for a user.
    /// @param user The address of the user.
    function lastFaucetRequest(address user) external view returns (uint256) {
        return _lastFaucetRequest[user];
    }

    // change the owner and admin of this contract
    function changeOwner(address _newOwner) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _adminAddress = _newOwner;
        _grantRole(DEFAULT_ADMIN_ROLE, _newOwner);
    }

}
