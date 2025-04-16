import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SimpleOFT } from '../typechain-types';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

describe('SimpleOFT Contract', function () {
  let simpleOFT: SimpleOFT;
  let owner: SignerWithAddress;
  let user: SignerWithAddress;
  let mockLzEndpoint: string;

  beforeEach(async function () {
    // Get signers
    [owner, user] = await ethers.getSigners();

    // Deploy a mock LZ endpoint address (just using a non-zero address)
    mockLzEndpoint = '0x0000000000000000000000000000000000000001';

    // Deploy the SimpleOFT contract
    const SimpleOFTFactory = await ethers.getContractFactory('SimpleOFT');
    simpleOFT = (await SimpleOFTFactory.connect(owner).deploy(
      'Simple OFT',
      'SOFT',
      mockLzEndpoint
    )) as unknown as SimpleOFT;
  });

  describe('Deployment', function () {
    it('should set the correct name and symbol', async function () {
      expect(await simpleOFT.name()).to.equal('Simple OFT');
      expect(await simpleOFT.symbol()).to.equal('SOFT');
    });

    it('should set the correct LZ endpoint', async function () {
      expect(await simpleOFT.lzEndpoint()).to.equal(mockLzEndpoint);
    });

    it('should set the correct owner', async function () {
      expect(await simpleOFT.owner()).to.equal(owner.address);
    });
  });

  describe('setLzEndpoint', function () {
    it('should allow owner to update LZ endpoint', async function () {
      const newEndpoint = '0x0000000000000000000000000000000000000002';
      await simpleOFT.connect(owner).setLzEndpoint(newEndpoint);
      expect(await simpleOFT.lzEndpoint()).to.equal(newEndpoint);
    });

    it('should revert if non-owner tries to update LZ endpoint', async function () {
      const newEndpoint = '0x0000000000000000000000000000000000000002';
      await expect(
        simpleOFT.connect(user).setLzEndpoint(newEndpoint)
      ).to.be.revertedWithCustomError(simpleOFT, 'OwnableUnauthorizedAccount');
    });

    it('should revert if trying to set zero address', async function () {
      const zeroAddress = '0x0000000000000000000000000000000000000000';
      await expect(
        simpleOFT.connect(owner).setLzEndpoint(zeroAddress)
      ).to.be.revertedWith('LZ endpoint cannot be zero address');
    });
  });

  describe('mint', function () {
    it('should allow users to mint tokens to themselves', async function () {
      const mintAmount = ethers.parseUnits('100', 18);
      await simpleOFT.connect(user).mint(mintAmount);
      expect(await simpleOFT.balanceOf(user.address)).to.equal(mintAmount);
    });
  });

  describe('bridgeTokens', function () {
    const mintAmount = ethers.parseUnits('100', 18);
    const bridgeAmount = ethers.parseUnits('50', 18);
    const dstChainId = 184; // BASE_CHAIN_ID

    beforeEach(async function () {
      // Mint tokens to user before each test
      await simpleOFT.connect(user).mint(mintAmount);
    });

    it('should burn tokens and emit Bridged event', async function () {
      // Check initial balance
      expect(await simpleOFT.balanceOf(user.address)).to.equal(mintAmount);

      // Bridge tokens
      await expect(
        simpleOFT.connect(user).bridgeTokens(bridgeAmount, dstChainId)
      )
        .to.emit(simpleOFT, 'Bridged')
        .withArgs(user.address, bridgeAmount, dstChainId);

      // Check balance after bridging
      const expectedBalance = mintAmount - bridgeAmount;
      expect(await simpleOFT.balanceOf(user.address)).to.equal(expectedBalance);
    });

    it('should revert if trying to bridge zero tokens', async function () {
      await expect(
        simpleOFT.connect(user).bridgeTokens(0, dstChainId)
      ).to.be.revertedWith('Amount must be greater than zero');
    });

    it('should revert if trying to bridge more tokens than balance', async function () {
      const excessAmount = ethers.parseUnits('200', 18); // More than the 100 minted
      await expect(
        simpleOFT.connect(user).bridgeTokens(excessAmount, dstChainId)
      ).to.be.revertedWith('Insufficient balance');
    });
  });

  describe('Chain IDs', function () {
    it('should have the correct chain ID constants', async function () {
      expect(await simpleOFT.ETHEREUM_CHAIN_ID()).to.equal(1);
      expect(await simpleOFT.BASE_CHAIN_ID()).to.equal(184);
    });
  });
});
