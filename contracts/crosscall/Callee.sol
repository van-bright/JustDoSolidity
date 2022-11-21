// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./ICallee.sol";

contract Callee is ICallee {

    string public name;
    uint   public age;

    function setName(string memory _name) public {
        name = _name;
    }

    function setAge(uint _age) public {
        age = _age;
    }
}
