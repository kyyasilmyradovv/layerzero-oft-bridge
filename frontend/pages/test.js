import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function Test() {
  const [address, setAddress] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  async function connect() {
    try {
      if (!window.ethereum) {
        setError('MetaMask not found');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAddress(accounts[0]);

      // Get network
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      setResult(`Connected to chain ID: ${network.chainId}`);
    } catch (err) {
      setError(err.message);
    }
  }

  async function testContract() {
    try {
      if (!contractAddress) {
        setError('Please enter contract address');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Minimal ABI for name() and balanceOf()
      const abi = [
        'function name() view returns (string)',
        'function balanceOf(address) view returns (uint256)',
      ];

      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Test name function
      const name = await contract.name();
      setResult(`Contract name: ${name}`);

      // Test balanceOf function
      const balance = await contract.balanceOf(address);
      setResult(
        (prev) =>
          `${prev}\nBalance: ${ethers.utils.formatEther(balance)} tokens`
      );
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Contract Test Page</h1>

      <div>
        <button onClick={connect}>Connect Wallet</button>
        {address && <p>Connected: {address}</p>}
      </div>

      <div style={{ margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Enter contract address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          style={{ width: '300px', padding: '5px' }}
        />
        <button onClick={testContract}>Test Contract</button>
      </div>

      {result && (
        <pre style={{ background: '#eee', padding: '10px' }}>{result}</pre>
      )}
      {error && (
        <pre style={{ background: '#fee', padding: '10px', color: 'red' }}>
          {error}
        </pre>
      )}
    </div>
  );
}
