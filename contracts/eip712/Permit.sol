
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./EIP712.sol";

contract Permit {
    // = keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)")
    bytes32 public constant PERMIT_TYPEHASH = 0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9;

    bytes32 public immutable DOMAIN_SEPARATOR;

    uint256 public nonce;

    constructor() {
        DOMAIN_SEPARATOR = EIP712.makeDomainSeparator("Permit", "1");
    }
    /**
     * @notice Verify a signed approval permit and execute if valid
     * @param owner     Token owner's address (Authorizer)
     * @param spender   Spender's address
     * @param value     Amount of allowance
     * @param deadline  The time at which this expires (unix time)
     * @param v         v of the signature
     * @param r         r of the signature
     * @param s         s of the signature
     */
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        require(msg.sender != address(this), "Caller is this contract");
        require(deadline >= block.timestamp, "Permit: permit is expired");

        bytes memory data = abi.encode(
            PERMIT_TYPEHASH,
            owner,
            spender,
            value,
            nonce,
            deadline
        );
        require(
            EIP712.recover(DOMAIN_SEPARATOR, v, r, s, data) == owner,
            "Permit: invalid signature"
        );

        // Signature Verified, do your own business
        ++nonce; // increase nonce to invalid this signature
    }
}