// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract HelloWorld {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    function sayHello() public view returns(string memory) {
        string memory hi = string(bytes.concat(bytes("hello, "), toString(abi.encodePacked(owner))));
        return hi;
    }

    function toString(bytes memory data) public pure returns(bytes memory) {
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < data.length; i++) {
            str[2+i*2] = alphabet[uint(uint8(data[i] >> 4))];
            str[3+i*2] = alphabet[uint(uint8(data[i] & 0x0f))];
        }
        return str;
    }
}