// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Storage.sol";

contract Delegator is AdminStorage {

    constructor() {
        admin = msg.sender;
    }

    function setImplementation(address impl) public {
        require(msg.sender == admin, "only admin allowed");
        implementation = impl;
    }

    receive() payable external {}

    fallback () payable external {
        // delegate all other functions to current implementation
        (bool success, ) = implementation.delegatecall(msg.data);

        assembly {
              let free_mem_ptr := mload(0x40)
              returndatacopy(free_mem_ptr, 0, returndatasize())

              switch success
              case 0 { revert(free_mem_ptr, returndatasize()) }
              default { return(free_mem_ptr, returndatasize()) }
        }
    }
}
