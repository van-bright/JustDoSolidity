// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ICallee {
    function setName(string memory name) external;
    function setAge(uint age) external;
    function name() external view returns(string memory);
    function age() external view returns(uint);
}