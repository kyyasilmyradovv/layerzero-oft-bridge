import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SimpleOFT } from '../typechain-types';

describe('SimpleOFT Contract', function () {
  let simpleOFT: SimpleOFT;
  let owner: any;
  let user: any;
  const lzEndpoint = '0x0000000000000000000000000000000000000001';

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();
    const SimpleOFTFactory = await ethers.getContractFactory(
      'SimpleOFT',
      owner
    );
    // Deploying with parameters: (string name, string symbol, address _lzEndpoint)
    simpleOFT = (await SimpleOFTFactory.deploy(
      'Test Token',
      'TST',
      lzEndpoint
    )) as SimpleOFT;
    await simpleOFT.deployed();
  });

  it('should mint tokens to the caller', async function () {
    const mintAmount = ethers.utils.parseEther('10');
    await simpleOFT.connect(user).mint(mintAmount);
    expect(await simpleOFT.balanceOf(user.address)).to.equal(mintAmount);
  });

  it('should allow owner to set new lzEndpoint', async function () {
    const newEndpoint = '0x0000000000000000000000000000000000000002';
    await simpleOFT.connect(owner).setLzEndpoint(newEndpoint);
    expect(await simpleOFT.lzEndpoint()).to.equal(newEndpoint);
  });

  it('should revert if non-owner tries to update lzEndpoint', async function () {
    await expect(
      simpleOFT
        .connect(user)
        .setLzEndpoint('0x0000000000000000000000000000000000000002')
    ).to.be.revertedWith('Ownable: caller is not the owner');
  });

  it('should bridge tokens properly by burning tokens and emitting Bridged event', async function () {
    const mintAmount = ethers.utils.parseEther('5');
    await simpleOFT.connect(user).mint(mintAmount);
    await expect(simpleOFT.connect(user).bridgeTokens(mintAmount, 100))
      .to.emit(simpleOFT, 'Bridged')
      .withArgs(user.address, mintAmount, 100);
    expect(await simpleOFT.balanceOf(user.address)).to.equal(0);
  });

  it('should revert if bridging with zero tokens', async function () {
    await expect(
      simpleOFT.connect(user).bridgeTokens(0, 100)
    ).to.be.revertedWith('Amount must be greater than zero');
  });

  it('should revert if bridging amount exceeds balance', async function () {
    const mintAmount = ethers.utils.parseEther('5');
    await simpleOFT.connect(user).mint(mintAmount);
    const excessiveAmount = ethers.utils.parseEther('10');
    await expect(
      simpleOFT.connect(user).bridgeTokens(excessiveAmount, 100)
    ).to.be.revertedWith('Insufficient balance');
  });
});
