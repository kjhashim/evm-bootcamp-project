// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "./TokenHandler.sol";

/// @title Spin the Wheel contract
/// @author Groups 1, 6
contract Wheel is Ownable {
    uint public minBet = 1;
    uint public maxBet = 10000;
    uint public houseSkewPercentage = 1;
    TokenHandler public tokenHandler; // track user balances, transfer tokens
    /// spin the wheel choices
    string[] spinChoices = ["red", "white"];

    /// @notice Flag indicating whether the lottery is open for bets or not
    bool private gameOpen;

    /// @notice Constructor function
    /// @param _tokenHandlerAddress address of TokenHandler for this game
    constructor(address _tokenHandlerAddress) Ownable(msg.sender) {
        tokenHandler = TokenHandler(_tokenHandlerAddress);
        gameOpen = true;
    }

    function openGame() external onlyOwner {
        gameOpen = true;
    }

    function closeGame() external onlyOwner {
        gameOpen = false;
    }
    function isGameOpen() public view returns (bool) {
        return gameOpen;
    }

    function bet(uint _numTokensBet, string memory _colorBet) external {
        require(gameOpen, "Game is closed");
        require((_numTokensBet >= minBet) && (_numTokensBet <= maxBet),
            string.concat(
                "Invalid number of tokens bet. You must bet at least ",
                Strings.toString(minBet),
                " tokens and no more than ",
                Strings.toString(maxBet)
            )
        );
        require(existsElement(_colorBet, spinChoices), "Invalid color bet");
        // check that user has enough balance to cover bet
        uint256 userBalance = tokenHandler.getStashBalance(msg.sender);
        require(userBalance >= _numTokensBet,
            string.concat(
                "User stash balance of ", Strings.toString(userBalance),
                "is insufficient to cover bet of ",
                Strings.toString(_numTokensBet),
                ". Please add more tokens to your stash."
            )
        );
        // check that kitty has enough balance to cover bet
        uint256 kittyBalance = tokenHandler.getGameKittyBalance();
        require(kittyBalance >= _numTokensBet,
            string.concat(
                "Game kitty balance of ", Strings.toString(kittyBalance),
                " is insufficient to cover bet of ",
                Strings.toString(_numTokensBet)
            )
        );
        string memory outcomeColor = chooseOutcome(_colorBet);
        // bet won, transfer from kitty to user stash
        if (keccak256(abi.encodePacked(_colorBet)) == keccak256(abi.encodePacked(outcomeColor))) {
            tokenHandler.withdrawGameKittyToStash(_numTokensBet);
        }
        else { // bet lost
            tokenHandler.depositStashToGameKitty(_numTokensBet);
        }

    }

    // Function to choose an outcome based on skewed probability
    function chooseOutcome(string memory _chosenBet) public view returns (string memory) {
        // probability of each outcome if each equally likely
        uint256 defaultProb = 100/spinChoices.length;
        // adjust probabilities by house skew
        uint256 chosenProb = defaultProb - houseSkewPercentage;
        uint256 otherProb = defaultProb + (houseSkewPercentage/(spinChoices.length-1));
        // uint256 chosenProb = defaultProb - (houseSkewPercentage/spinChoices.length);
        // uint256 otherProb = defaultProb + ((houseSkewPercentage/spinChoices.length)/(spinChoices.length-1));
        // Get a random number between 0 and 99
        uint256 randomValue = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao))) % 100;
        
        uint256 cumulativeWeight = 0;

        // Loop through the outcomes and pick the one based on the random number
        for (uint256 i = 0; i < spinChoices.length; i++) {
            if (keccak256(abi.encodePacked(_chosenBet)) == keccak256(abi.encodePacked(spinChoices[i]))) {
                cumulativeWeight += chosenProb;
            }
            else {
                cumulativeWeight += otherProb;
            }
            if (randomValue < cumulativeWeight) {
                // The outcome has been chosen
                return spinChoices[i];
            }
        }
        return spinChoices[spinChoices.length-1];
    }


    /// check if element exists in the array
    function existsElement(string memory _element, string[] memory _array) public pure returns (bool) {
        for (uint i = 0; i < _array.length; i++) {
            if (keccak256(abi.encodePacked(_element)) == keccak256(abi.encodePacked(_array[i]))) {
                return true;
            }
        }
        return false;
    }

}
