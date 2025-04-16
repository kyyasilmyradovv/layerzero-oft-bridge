import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import axios from 'axios';
import Layout from '../components/Layout';
import Notification from '../components/Notification';
import { injected, CHAIN_NAMES, TOKEN_CONTRACT_ADDRESS } from '../utils/web3';
import SimpleOFTABI from '../utils/SimpleOFT.json';
import { Button } from '../components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from '../components/ui/card.jsx';

export default function Home() {
  const { active, account, library, activate, deactivate } = useWeb3React();

  const [balance, setBalance] = useState('0');
  const [amount, setAmount] = useState('');
  const [destChain, setDestChain] = useState('184'); // Default to BASE
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [notification, setNotification] = useState(null);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Connect wallet
  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex);
      showNotification('Failed to connect wallet: ' + ex.message, 'error');
    }
  }

  // Disconnect wallet
  async function disconnect() {
    try {
      deactivate();
    } catch (ex) {
      console.log(ex);
      showNotification('Failed to disconnect wallet', 'error');
    }
  }

  // Get token balance
  useEffect(() => {
    if (active && account) {
      const getBalance = async () => {
        const signer = library.getSigner();
        const contract = new ethers.Contract(
          TOKEN_CONTRACT_ADDRESS,
          SimpleOFTABI.abi,
          signer
        );

        try {
          const balance = await contract.balanceOf(account);
          setBalance(ethers.utils.formatEther(balance));
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      };

      getBalance();
      fetchHistory();
    }
  }, [active, account, library]);

  // Fetch transfer history
  const fetchHistory = async () => {
    if (!account) return;

    try {
      const response = await axios.get(
        `http://localhost:3001/api/bridge-history?address=${account}`
      );
      if (response.data) {
        setHistory(response.data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  // Mint tokens (for testing)
  const mintTokens = async () => {
    if (!active || !library) return;

    setIsLoading(true);
    try {
      const signer = library.getSigner();
      const contract = new ethers.Contract(
        TOKEN_CONTRACT_ADDRESS,
        SimpleOFTABI.abi,
        signer
      );

      const tx = await contract.mint(ethers.utils.parseEther('10'));
      await tx.wait();

      // Update balance
      const newBalance = await contract.balanceOf(account);
      setBalance(ethers.utils.formatEther(newBalance));

      showNotification('Successfully minted 10 tokens!');
    } catch (error) {
      console.error('Error minting tokens:', error);
      showNotification('Failed to mint tokens: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Bridge tokens
  const bridgeTokens = async () => {
    if (!active || !library || !amount) return;

    setIsLoading(true);
    try {
      const signer = library.getSigner();
      const contract = new ethers.Contract(
        TOKEN_CONTRACT_ADDRESS,
        SimpleOFTABI.abi,
        signer
      );

      const parsedAmount = ethers.utils.parseEther(amount);
      const tx = await contract.bridgeTokens(parsedAmount, parseInt(destChain));
      await tx.wait();

      // Update balance
      const newBalance = await contract.balanceOf(account);
      setBalance(ethers.utils.formatEther(newBalance));

      // Update history
      fetchHistory();

      showNotification('Tokens bridged successfully!');
      setAmount('');
    } catch (error) {
      console.error('Error bridging tokens:', error);
      showNotification('Failed to bridge tokens: ' + error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Format timestamp without milliseconds
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <div className="space-y-8">
        {/* Wallet Connection Section */}
        <Card>
          <CardHeader>
            <CardTitle>Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to interact with the bridge
            </CardDescription>
          </CardHeader>
          <CardContent>
            {active ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Address</p>
                  <p className="font-mono text-sm truncate">{account}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Balance</p>
                  <p className="text-2xl font-bold">
                    {balance} <span className="text-sm">SOFT</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="mb-4 text-muted-foreground">
                  Connect your wallet to use the bridge
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            {active ? (
              <>
                <Button
                  variant="outline"
                  onClick={mintTokens}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Mint 10 Tokens'}
                </Button>
                <Button variant="outline" onClick={disconnect}>
                  Disconnect
                </Button>
              </>
            ) : (
              <Button onClick={connect}>Connect Wallet</Button>
            )}
          </CardFooter>
        </Card>

        {/* Bridge Section */}
        {active && (
          <Card>
            <CardHeader>
              <CardTitle>Bridge Tokens</CardTitle>
              <CardDescription>
                Transfer your tokens across chains
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount to bridge"
                    className="w-full border border-input p-2 rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Destination Chain
                  </label>
                  <select
                    value={destChain}
                    onChange={(e) => setDestChain(e.target.value)}
                    className="w-full border border-input p-2 rounded-md bg-background"
                  >
                    <option value="1">Ethereum</option>
                    <option value="184">BASE</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={bridgeTokens}
                disabled={!amount || isLoading}
              >
                {isLoading ? 'Processing...' : 'Bridge Tokens'}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* History Section */}
        {active && (
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View your recent bridge transfers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {history && history.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">
                          Amount
                        </th>
                        <th className="text-left p-3 text-sm font-medium">
                          Destination
                        </th>
                        <th className="text-left p-3 text-sm font-medium">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {history.map((item, index) => (
                        <tr key={index} className="hover:bg-muted/50">
                          <td className="p-3 text-sm">
                            {ethers.utils.formatEther(item.amount)} SOFT
                          </td>
                          <td className="p-3 text-sm">
                            {CHAIN_NAMES[item.dstChain] || item.dstChain}
                          </td>
                          <td className="p-3 text-sm">
                            {formatDate(item.timestamp)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No transfer history found
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
