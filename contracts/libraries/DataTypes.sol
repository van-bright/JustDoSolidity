// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


// We define a new struct datatype that will be used to
// hold its data in the calling contract.
struct Data {
    mapping(uint => bool) flags;
}
