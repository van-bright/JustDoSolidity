// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../../subclass/ERC20.sol";

contract TokenB is ERC20 {

    constructor() ERC20("Token B", "TB") {}

    function mint(address to, uint amount) public {
        _mint(to, amount);
    }
}
