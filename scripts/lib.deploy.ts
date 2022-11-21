import { ethers } from "hardhat";

async function main() {
    const ExtLib = await ethers.getContractFactory("ExtLib");
    const lib = await ExtLib.deploy();
    await lib.deployed();
    console.log(`ExtLib deployed at: ${lib.address}`);

    const MainEntry = await ethers.getContractFactory("MainEntry", {libraries: { ExtLib: lib.address}});
    const entry = await MainEntry.deploy();
    await entry.deployed();

    console.log(`MainEntry deployed at: ${entry.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
