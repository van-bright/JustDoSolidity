// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./ICallee.sol";

contract Caller {
    ICallee callee;
    constructor(ICallee _callee) {
        callee = _callee;
    }

    function callSetName(string memory name) public {
        callee.setName(name);
    }

    function callSetAge(uint age) public {
        callee.setAge(age);
    }

    function callSetName2(address _callee, string memory name) public {

        (bool status, bytes memory result) = _callee.call(
            abi.encodeWithSignature("setName(string)", name)
        );

        require(status, string(result));
    }

    function queryName(address _callee) public view returns(string memory) {
        (bool status, bytes memory result) = _callee.staticcall(
            abi.encodeWithSignature("name()")
        );

        if (!status) return "failed";

        return abi.decode(result, (string));
    }
}
