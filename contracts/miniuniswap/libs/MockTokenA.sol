// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../../subclass/ERC20.sol";

contract TokenA is ERC20 {

    constructor() ERC20("Token A", "TA") {}

    function mint(address to, uint amount) public {
        _mint(to, amount);
    }
}
