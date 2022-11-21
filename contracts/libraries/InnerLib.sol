// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./DataTypes.sol";

library InnerLib {
    function remove(Data storage self, uint value)
        internal
        returns (bool)
    {
        if (!self.flags[value])
            return false; // not there

        self.flags[value] = false;
        return true;
    }
}
