import { ethers } from "hardhat";

async function main() {
    let [owner, employer1, employer2] = await ethers.getSigners();
    // const ComplexDataType = await ethers.getContractFactory("ComplexDataType");
    // const ins = await ComplexDataType.deploy();
    // await ins.deployed();

    const ins = await ethers.getContractAt('ComplexDataType', "0x5FbDB2315678afecb367f032d93F642f64180aa3");

    console.log(`address deployed: ${ins.address}`);

    await ins.connect(owner).addEmployor({
        wallet: employer1.address,
        age: 24,
        salary: 3000,
        department: "Marketing",
        start: 16844567,
        end: 17844567,
        typ: 1
    })


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
