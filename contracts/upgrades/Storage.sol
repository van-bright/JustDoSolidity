// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract AdminStorage {
    address public admin;
    address public implementation;
}

contract BusinessStorageV1 is AdminStorage {
    uint256 public version;
}

contract BusinessStorageV2 is BusinessStorageV1 {
    uint256 public isbn;
}