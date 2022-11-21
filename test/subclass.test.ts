import { expect } from "chai";
import { ethers } from "hardhat";

import { BigNumber } from "ethers";
import { BlackableCoin } from "../typechain-types";

describe("BlackableCoin", function () {
    let bc: BlackableCoin;

    before(async () => {
        const BlackableCoin = await ethers.getContractFactory("BlackableCoin");
        bc = await BlackableCoin.deploy();
        await bc.deployed();
    });

    it("functions", async () => {
        let [owner, player1, player2, player3] = await ethers.getSigners();
        expect(await bc.name()).to.equal("Blackable Coin");
        expect(await bc.symbol()).to.equal("BC");

        await bc.connect(owner).mint(player1.address, ethers.utils.parseEther("10000"));
        await bc.connect(owner).mint(player2.address, ethers.utils.parseEther("10000"));

        await bc.connect(player1).transfer(player3.address, ethers.utils.parseEther("100"));

        expect(await bc.balanceOf(player3.address)).to.equal(ethers.utils.parseEther("100"));

        await bc.connect(owner).setBlacked(player1.address);
        await bc.connect(owner).setBlacked(player2.address);

        await expect(bc.connect(player1).transfer(player3.address, ethers.utils.parseEther("20"))).to.revertedWith("from blacked");
        await expect(bc.connect(player3).transfer(player2.address, ethers.utils.parseEther("20"))).to.revertedWith("to blacked");
    });
});