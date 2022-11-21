import { expect } from "chai";
import { ethers } from "hardhat";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumberish, BytesLike } from "ethers";
import { Permit } from "../typechain-types";
// The named list of all type definitions
interface Types {
    [key: string]: {name: string, type: string}[]
};

export class Eip712Domain {
    constructor(
        public name: string,
        public version: string,
        public verifyingContract: string,
        public chainId: number,
    ) {}
}

abstract class MetaTx {
    [key: string]: any;
    async sign(domain: Eip712Domain, singer: SignerWithAddress): Promise<{v: BigNumberish, r: BytesLike, s: BytesLike}> {
        const signatureBuy = await singer._signTypedData(domain, this.types(), this.values());
        const sig = ethers.utils.splitSignature(signatureBuy)
        return {v: sig.v, r: sig.r, s: sig.s};
    }

    abstract types(): Types;
    values(): {[key: string]: any} { return this; }
}

export class PermitTx extends MetaTx {

    constructor(
        public owner: string,
        public spender: string,
        public value: string,
        public nonce: string,
        public deadline: string,
    ) {
        super();
    }

    types(): Types {
        return {
            Permit: [
                {name: "owner", type: "address"},
                {name: "spender", type: "address"},
                {name: "value", type: "uint256"},
                {name: "nonce", type: "uint256"},
                {name: "deadline", type: "uint256"},
            ]
        };
    }
}

describe("Permit", function () {
    let permitIns: Permit;

    beforeEach(async () => {
        const Permit = await ethers.getContractFactory('Permit');
        permitIns = await Permit.deploy();
        await permitIns.deployed();
    });

    it("permit", async () => {
        const [player1, player2, relayer] = await ethers.getSigners();

        let domain = {
            name: 'Permit',
            version: '1',
            chainId: ethers.provider.network.chainId,
            verifyingContract: permitIns.address,
        } as Eip712Domain;

        const blockTime = (await ethers.provider.getBlock('latest')).timestamp;

        const owner = player1.address;
        const spender = player2.address;
        const value = ethers.utils.parseEther('200').toHexString();
        const nonce = await permitIns.nonce();
        const deadline = (blockTime + 3).toString();

        const permitTX = new PermitTx(owner, spender, value, nonce.toString(), deadline);
        let sig = await permitTX.sign(domain, player1);

        await permitIns.connect(relayer).permit(
            owner,
            spender,
            value,
            deadline,
            sig.v, sig.r, sig.s
        );

        const nonceAfter = await permitIns.nonce();

        expect(nonceAfter.sub(nonce)).to.equal(1);

        // can not be permit again via same signature.
        await expect(permitIns.connect(relayer).permit(
            owner,
            spender,
            value,
            deadline,
            sig.v, sig.r, sig.s
        )).to.revertedWith("Permit: invalid signature");
    });
});