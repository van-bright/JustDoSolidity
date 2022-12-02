import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import { BigNumber } from "ethers";
import { ComplexDataType} from "../typechain-types";

describe("Employee", function () {
    let employee: ComplexDataType;
    let owner: SignerWithAddress;
    let employer1: SignerWithAddress;
    let employer2: SignerWithAddress;

    before(async () => {
        [owner, employer1, employer2] = await ethers.getSigners();

        const C = await ethers.getContractFactory("ComplexDataType");
        employee = await C.connect(owner).deploy();
        await employee.deployed();
    });

    it("add empoy", async () => {
        await employee.connect(owner).addEmployor({
            wallet: employer1.address,
            age: 24,
            salary: 3000,
            department: "Marketing",
            start: 16844567,
            end: 17844567,
            typ: 1
        });

        await expect(
            employee.connect(owner).addEmployor({
            wallet: employer2.address,
            age: 30,
            salary: 3500,
            department: "Sales",
            start: 16844567,
            end: 17844567,
            typ: 1
        })).to.emit(employee, "EmployerAdded").withArgs(employer2.address, "Sales", 16844567, 17844567);

        await expect(
            employee.connect(owner).addEmployor({
            wallet: employer2.address,
            age: 30,
            salary: 3500,
            department: "Sales",
            start: 16844567,
            end: 17844567,
            typ: 1
        })).to.revertedWith("wallet exist");

        expect((await employee.employers(0))[0]).to.equal(employer1.address);
        expect((await employee.employers(1))[0]).to.equal(employer2.address);
    });

    it("incoming", async () => {
        await employee.connect(owner).incoming({value: ethers.utils.parseEther("1.0")});

        expect(await ethers.provider.getBalance(employee.address)).to.equal(ethers.utils.parseEther("1.0"));

        await expect(employee.connect(owner).incoming({value: ethers.utils.parseEther("2.0")})).to.revertedWith("incoming value invalid");
    });

    it("pay", async () => {
        const e2BalanceBefore = await ethers.provider.getBalance(employer2.address);

        await employee.connect(owner).pay(employer2.address);

        const e2BalanceAfter = await ethers.provider.getBalance(employer2.address);

        expect(e2BalanceAfter.sub(e2BalanceBefore)).to.equal(ethers.utils.parseEther("0.1"));
    });
});