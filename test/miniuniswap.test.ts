import { expect } from "chai";
import { ethers } from "hardhat";

import { BigNumber } from "ethers";
import { TokenA, TokenB, UniswapFactory, UniswapRouter } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

function sortTokens(tokenA: string, tokenB: string) {
    let nTokenA = BigNumber.from(tokenA);
    let nTokenB = BigNumber.from(tokenB);

    if (nTokenA.gt(nTokenB)) return [tokenB, tokenA];
    else return [tokenA, tokenB];
}

function sqrt(y: BigNumber) {
    let z = BigNumber.from(0);

    if (y.gt(3)) {
        z = y;
        let x = y.div(2).add(1);
        while (x.lt(z)) {
            z = x;
            x = y.div(x).add(x).div(2);
        }
    } else if (!y.eq(0)) {
        z = BigNumber.from(1);
    }

    return z;
}

const Ethers = ethers.utils.parseEther;

describe("MiniUniswap", function () {
    let router: UniswapRouter;
    let factory: UniswapFactory;
    let tokenA: TokenA;
    let tokenB: TokenB;
    let lp1: SignerWithAddress;
    let lp2: SignerWithAddress;

    before(async () => {
        [lp1, lp2] = await ethers.getSigners();

        const TokenA = await ethers.getContractFactory("TokenA");
        tokenA = await TokenA.deploy();
        await tokenA.deployed();

        const TokenB = await ethers.getContractFactory("TokenB");
        tokenB = await TokenB.deploy();
        await tokenB.deployed();

        const UniswapFactory = await ethers.getContractFactory("UniswapFactory");
        factory = await UniswapFactory.deploy();
        await factory.deployed();

        const UniswapRouter = await ethers.getContractFactory("UniswapRouter");
        router = await UniswapRouter.deploy(factory.address);
        await router.deployed();

        await tokenA.mint(lp1.address, Ethers("100000"));
        await tokenB.mint(lp1.address, Ethers("100000"));

        await tokenA.mint(lp2.address, Ethers("100000"));
        await tokenB.mint(lp2.address, Ethers("100000"));

        await tokenA.connect(lp1).approve(router.address, Ethers("100000"));
        await tokenA.connect(lp2).approve(router.address, Ethers("100000"));

        await tokenB.connect(lp1).approve(router.address, Ethers("100000"));
        await tokenB.connect(lp2).approve(router.address, Ethers("100000"));
    });

    it("create pairs", async () => {
        await factory.createPair(tokenA.address, tokenB.address);
        expect(await factory.allPairsLength()).to.equal(1);

        const pair1 = await factory.getPair(tokenA.address, tokenB.address);

        let uniswapPair = await ethers.getContractAt("UniswapPair", pair1);
        let token0 = await uniswapPair.token0();
        let token1 = await uniswapPair.token1();

        let [a, b] = sortTokens(tokenA.address, tokenB.address);
        expect(token0).to.equal(a);
        expect(token1).to.equal(b);
    });

    it("add liquidity", async () => {
        const amountADesired = Ethers("10");
        const amountBDesired = Ethers("50");
        const amountAMin = Ethers("5");
        const amountBMin = Ethers("8");

        const pair1 = await factory.getPair(tokenA.address, tokenB.address);

        let uniswapPair = await ethers.getContractAt("UniswapPair", pair1);

        const MIN_LIQUIDITY = await uniswapPair.MINIMUM_LIQUIDITY();

        let balance0A = await tokenA.balanceOf(lp1.address);
        let balance0B = await tokenB.balanceOf(lp1.address);

        let balance0 = await uniswapPair.balanceOf(lp1.address);
        await router.connect(lp1).addLiquidity(
            tokenA.address,
            tokenB.address,
            amountADesired,
            amountBDesired,
            amountAMin,
            amountBMin,
            lp1.address
        );
        let balance1 = await uniswapPair.balanceOf(lp1.address);

        const reserveLiquidity = await uniswapPair.balanceOf(ethers.constants.AddressZero);
        expect(MIN_LIQUIDITY).to.equal(reserveLiquidity);

        let balance1A = await tokenA.balanceOf(lp1.address);
        let balance1B = await tokenB.balanceOf(lp1.address);

        let amountA = balance0A.sub(balance1A);
        let amountB = balance0B.sub(balance1B);

        let liquidity = sqrt(amountA.mul(amountB)).sub(MIN_LIQUIDITY);

        expect(liquidity).to.equal(balance1.sub(balance0));

    });

    it("swap", async () => {
        const pair1 = await factory.getPair(tokenA.address, tokenB.address);

        // swap TokenA for TokenB
        let b0 = await tokenB.balanceOf(lp2.address);
        let bp0 = await tokenB.balanceOf(pair1);
        await router.connect(lp2).swapExactTokensForTokens(
            Ethers("2"),
            Ethers("0"),
            [tokenA.address, tokenB.address],
            lp2.address
        );
        let b1 = await tokenB.balanceOf(lp2.address);
        let bp1 = await tokenB.balanceOf(pair1);

        expect(bp0.sub(bp1)).to.equal(b1.sub(b0));

    });

    it("remove liquidity", async () => {
        const pair1 = await factory.getPair(tokenA.address, tokenB.address);
        let uniswapPair = await ethers.getContractAt("UniswapPair", pair1);

        let blp1 = await uniswapPair.balanceOf(lp1.address);

        let ba0 = await tokenA.balanceOf(lp1.address);
        let bb0 = await tokenB.balanceOf(lp1.address);

        let bap0 = await tokenA.balanceOf(pair1);
        let bbp0 = await tokenB.balanceOf(pair1);

        await uniswapPair.connect(lp1).approve(router.address, blp1);

        await router.removeLiquidity(
            tokenA.address,
            tokenB.address,
            blp1.div(2),
            0,
            0,
            lp1.address
        );

        let ba1 = await tokenA.balanceOf(lp1.address);
        let bb1 = await tokenB.balanceOf(lp1.address);

        let bap1 = await tokenA.balanceOf(pair1);
        let bbp1 = await tokenB.balanceOf(pair1);

        expect(bap0.sub(bap1)).to.equal(ba1.sub(ba0));
        expect(bbp0.sub(bbp1)).to.equal(bb1.sub(bb0));

        expect(blp1.div(2)).to.equal(await uniswapPair.balanceOf(lp1.address));
    });
});
