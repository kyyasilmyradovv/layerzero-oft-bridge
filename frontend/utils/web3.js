import { InjectedConnector } from '@web3-react/injected-connector';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 5, 137, 80001, 184, 31337], // Ethereum, Goerli, Polygon, Mumbai, BASE
});

export const CHAIN_NAMES = {
  1: 'Ethereum Mainnet',
  5: 'Goerli Testnet',
  137: 'Polygon Mainnet',
  80001: 'Mumbai Testnet',
  184: 'BASE',
};

export const TOKEN_CONTRACT_ADDRESS =
  '0x5FbDB2315678afecb367f032d93F642f64180aa3';
// '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // TODO: Replace with your deployed contract address
