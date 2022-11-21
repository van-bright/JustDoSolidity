import { expect } from "chai";
import { ethers } from "hardhat";

import { BigNumber } from "ethers";
import { Delegator, ImplV1, ImplV2 } from "../typechain-types";

describe("MainEntry", function () {
    let delegator: Delegator;
    let implV1: ImplV1;
    let implV2: ImplV2;


    before(async () => {
        const Delegator = await ethers.getContractFactory("Delegator");
        delegator = await Delegator.deploy();
        await delegator.deployed();

        const ImplV1 = await ethers.getContractFactory("ImplV1");
        implV1 = await ImplV1.deploy();
        await implV1.deployed();

        const ImplV2 = await ethers.getContractFactory("ImplV2");
        implV2 = await ImplV2.deploy();
        await implV2.deployed();
    });

    it("use v1", async () => {
        await delegator.setImplementation(implV1.address);

        const v1 = await ethers.getContractAt("ImplV1", delegator.address);

        await v1.setVersion(3811);

        console.log(`impl v1 is not set: ${await implV1.version()}`);

        expect(await v1.version()).to.equal(3811);
    });

    it("use v2", async () => {
        await delegator.setImplementation(implV2.address);

        const v2 = await ethers.getContractAt("ImplV2", delegator.address);

        await v2.setISBN(9527);

        expect(await v2.version()).to.equal(3811);
        expect(await v2.isbn()).to.equal(9527);
    });
});