
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./DataTypes.sol";

import "./ExtLib.sol";
import "./InnerLib.sol";

contract MainEntry {
    using ExtLib for Data;
    using InnerLib for Data;

    Data collection;

    function register(uint value) public {
        require(ExtLib.insert(collection, value));
    }

    function contains(uint value) public view returns(bool) {
        return collection.contains(value);
    }

    function remove(uint256 value) public returns(bool) {
        return collection.remove(value);
    }
}