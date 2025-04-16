import { ethers } from "hardhat";
import { expect } from "chai";

describe("SimpleOFT Minting", function () {
    let token: any;
    let owner: any;
    let addr1: any;

    beforeEach(async function () {
        const Token = await ethers.getContractFactory("SimpleOFT");
        token = await Token.deploy("MyToken", "MTK", 1000, "0xLayerZeroEndpoint");
        [owner, addr1] = await ethers.getSigners();
    });

    it("Should mint tokens to the owner", async function () {
        await token.mint(owner.address, 100);
        const balance = await token.balanceOf(owner.address);
        expect(balance).to.equal(100);
    });

    it("Should not allow minting to zero address", async function () {
        await expect(token.mint(ethers.constants.AddressZero, 100)).to.be.revertedWith("ERC20: mint to the zero address");
    });

    it("Should emit a Minted event on successful minting", async function () {
        await expect(token.mint(owner.address, 100))
            .to.emit(token, "Minted")
            .withArgs(owner.address, 100);
    });

    it("Should not allow minting more than the total supply", async function () {
        await token.mint(owner.address, 1000);
        await expect(token.mint(owner.address, 1)).to.be.revertedWith("ERC20: mint amount exceeds total supply");
    });
});