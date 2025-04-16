import { ethers } from 'hardhat';

async function main() {
  // Mock LZ endpoint for testing
  const mockLzEndpoint = '0x0000000000000000000000000000000000000001';

  // Deploy the SimpleOFT contract
  const SimpleOFT = await ethers.getContractFactory('SimpleOFT');
  const simpleOFT = await SimpleOFT.deploy(
    'Simple OFT',
    'SOFT',
    mockLzEndpoint
  );

  await simpleOFT.waitForDeployment();

  // Get the deployed contract address
  const address = await simpleOFT.getAddress();

  console.log(`SimpleOFT deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
