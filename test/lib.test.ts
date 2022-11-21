import { expect } from "chai";
import { ethers } from "hardhat";

import { BigNumber } from "ethers";
import { MainEntry } from "../typechain-types";

describe("MainEntry", function () {
    let entry: MainEntry;

    beforeEach(async () => {
        const ExtLib = await ethers.getContractFactory("ExtLib");
        const lib = await ExtLib.deploy();
        await lib.deployed();

        const MainEntry = await ethers.getContractFactory("MainEntry", {libraries: { ExtLib: lib.address}});
        entry = await MainEntry.deploy();
        await entry.deployed();
    });

    it("logics", async () => {
        const targetNumber = BigNumber.from("3811");

        expect(await entry.contains(targetNumber)).to.be.false;

        await entry.register(targetNumber);
        expect(await entry.contains(targetNumber)).to.be.true;

        await entry.remove(targetNumber);
        expect(await entry.contains(targetNumber)).to.be.false;
    });
});