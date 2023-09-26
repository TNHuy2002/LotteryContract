// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value == 1 ether, "Every player must enter with 1 ether");
        players.push(msg.sender);
    }

    function pickWinner() public {
        require(msg.sender == manager, "Only manager can pick a winner");
        require(players.length != 0, "The length of player array is 0");

        uint contractBalance = address(this).balance;
        uint random = generateRandomNumber();
        uint indexWinner = random % players.length;

        // Changed to new syntax for sending value
        (bool success, ) = players[indexWinner].call{value: contractBalance}("");
        require(success, "Failed to send money.");

        // Reset the players list
        delete players;
    }

    function generateRandomNumber() private view returns (uint) {
        uint randomNum = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players.length)));
        return randomNum;
    }

    function getPlayers() public view returns (address[] memory) {
        require(msg.sender == manager, "Only manager can get player list");
        return players;
    }
}
