import { expect } from "chai";
import { ethers } from "hardhat";

import { Callee, Caller} from "../typechain-types";

describe("MainEntry", function () {
    let caller: Caller;
    let callee1: Callee;
    let callee2: Callee;

    before(async () => {
        const Callee = await ethers.getContractFactory("Callee");
        callee1 = await Callee.deploy();
        await callee1.deployed();

        callee2 = await Callee.deploy();
        await callee2.deployed();

        const Caller = await ethers.getContractFactory("Caller");
        caller = await Caller.deploy(callee1.address);
        await caller.deployed();
    });

    it("cross call normal way", async () => {
        caller.callSetName("Musk");
        caller.callSetAge(46);

        expect(await callee1.name()).to.equal("Musk");
        expect(await callee1.age()).to.equal(46);
    });

    it("cross call via address", async () => {
        await caller.callSetName2(callee2.address, "Bill");

        expect(await caller.queryName(callee2.address)).to.equal("Bill");
        expect(await caller.queryName(callee1.address)).to.equal("Musk");

        expect(await callee2.name()).to.equal("Bill");
    });
});