// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Storage.sol";

contract ImplV2 is BusinessStorageV2 {

    function setVersion(uint256 ver) public {
        version = ver;
    }

    function setISBN(uint256 _isbn) public {
        isbn = _isbn;
    }
}

