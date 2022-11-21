// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Storage.sol";

contract ImplV1 is BusinessStorageV1 {

    function setVersion(uint256 ver) public {
        version = ver;
    }
}

