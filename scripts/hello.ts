import { ethers } from "hardhat";

async function main() {
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const hello = await HelloWorld.deploy();
    await hello.deployed();

    console.log(`say: ${await hello.sayHello()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
