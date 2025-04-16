import { expect } from "chai";
import { ethers } from "hardhat";
import { SimpleOFT } from "../typechain-types/SimpleOFT";

describe("Cross-Chain Token Transfer", function () {
    let token: SimpleOFT;
    let owner: string;
    let addr1: string;
    let addr2: string;

    beforeEach(async function () {
        const Token = await ethers.getContractFactory("SimpleOFT");
        token = await Token.deploy("OmniToken", "OTK", "0xLayerZeroEndpointAddress");
        await token.deployed();

        [owner, addr1, addr2] = await ethers.getSigners();
    });

    it("Should mint tokens to the owner", async function () {
        const mintAmount = ethers.utils.parseUnits("100", 18);
        await token.mint(owner, mintAmount);
        const balance = await token.balanceOf(owner);
        expect(balance).to.equal(mintAmount);
    });

    it("Should allow cross-chain transfer", async function () {
        const mintAmount = ethers.utils.parseUnits("100", 18);
        await token.mint(owner, mintAmount);

        const dstChainId = 1; // Example destination chain ID
        await token.bridge(addr1, mintAmount, dstChainId);

        const ownerBalance = await token.balanceOf(owner);
        const addr1Balance = await token.balanceOf(addr1);
        expect(ownerBalance).to.equal(0);
        expect(addr1Balance).to.equal(mintAmount);
    });

    it("Should revert on zero address transfer", async function () {
        const mintAmount = ethers.utils.parseUnits("100", 18);
        await token.mint(owner, mintAmount);

        await expect(token.bridge("0x0000000000000000000000000000000000000000", mintAmount, 1))
            .to.be.revertedWith("Invalid address");
    });

    it("Should revert on invalid amount transfer", async function () {
        const mintAmount = ethers.utils.parseUnits("100", 18);
        await token.mint(owner, mintAmount);

        await expect(token.bridge(addr1, 0, 1))
            .to.be.revertedWith("Invalid amount");
    });
});