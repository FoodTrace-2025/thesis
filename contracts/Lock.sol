// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Lock
 * @dev A simple time-locked contract that holds ETH until a specified unlock time.
 * This is a placeholder contract for verifying Hardhat setup.
 * Will be replaced with FoodTrace contracts in Epic 3.
 */
contract Lock {
    uint public unlockTime;
    address payable public owner;

    event Withdrawal(uint amount, uint when);

    constructor(uint _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }
}
