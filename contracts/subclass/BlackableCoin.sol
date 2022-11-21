// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "./ERC20.sol";


contract BlackableCoin is ERC20 {

    mapping(address => bool) blacklist;

    address owner;

    constructor() ERC20("Blackable Coin", "BC") {
        owner = msg.sender;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal view override {
        require(!blacklist[from], "from blacked");
        require(!blacklist[to], "to blacked");
        amount;
    }

    function mint(address to, uint256 amount) public {
        require(msg.sender == owner, "only owner");

        _mint(to, amount);
        // super._mint(to, amount);
    }

    function setBlacked(address who) public {
        require(msg.sender == owner, "only owner");

        blacklist[who] = true;
    }
}
