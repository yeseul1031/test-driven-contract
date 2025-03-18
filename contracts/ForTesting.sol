// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ForTesting {
    address public owner;
    uint256 public value;
    mapping(address => uint256) public balances;

    event ValueChanged(uint256 oldValue, uint256 newValue);
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setValue(uint256 _value) external onlyOwner {
        emit ValueChanged(value, _value);
        value = _value;
    }

    function deposit() external payable {
        require(msg.value > 0, "Must send ETH");
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(uint256 _amount) external {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);
        emit Withdrawn(msg.sender, _amount);
    }
}
