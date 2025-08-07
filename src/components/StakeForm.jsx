import React, { useState } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import EthereumProvider from '@walletconnect/ethereum-provider';
import HFVStaking from '../abi/HFVStaking.json';
import HFVToken from '../abi/HFVToken.json';

const stakingAbi = HFVStaking.abi;
const tokenAbi = HFVToken.abi;

const stakingAddress = import.meta.env.VITE_HFV_STAKING_ADDRESS;
const tokenAddress = import.meta.env.VITE_HFV_TOKEN_ADDRESS;
const projectId = import.meta.env.VITE_PROJECT_ID;

export default function StakeForm() {
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const connectProvider = async () => {
    if (window.ethereum) {
      return new BrowserProvider(window.ethereum);
    } else {
      const walletConnect = await EthereumProvider.init({
        projectId: projectId,
        chains: [1],
        showQrModal: true,
        methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData'],
      });
      return new BrowserProvider(walletConnect);
    }
  };

  const handleApprove = async () => {
    if (!amount || !stakingAddress || !tokenAddress) return;
    setIsLoading(true);
    setStatus('🔄 Connecting wallet...');

    try {
      const provider = await connectProvider();
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      const amountInWei = ethers.parseUnits(amount, 18);

      setStatus('🔐 Awaiting approval...');
      const approveTx = await tokenContract.approve(stakingAddress, amountInWei);
      await approveTx.wait();

      setIsApproved(true);
      setStatus('✅ Approval successful! You can now stake.');
    } catch (err) {
      console.error('Approval Error:', err);
      setStatus(`❌ Approval failed: ${err.reason || err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStake = async () => {
    if (!amount || !duration || !isApproved || isLoading) return;
    setIsLoading(true);
    setStatus('🔄 Connecting wallet...');

    try {
      const provider = await connectProvider();
      const signer = await provider.getSigner();
      const stakingContract = new ethers.Contract(stakingAddress, stakingAbi, signer);
      const amountInWei = ethers.parseUnits(amount, 18);

      setStatus('⚡ Sending stake transaction...');
      const stakeTx = await stakingContract.stake(amountInWei, Number(duration));
      await stakeTx.wait();

      setStatus('✅ Stake successful!');
      setAmount('');
      setDuration('');
      setIsApproved(false);
    } catch (err) {
      console.error('Stake Error:', err);
      setStatus(`❌ Stake failed: ${err.reason || err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="stake-form">
      <h3 className="section-title">Stake HFV Tokens</h3>

      <input
        className="input-field"
        type="number"
        placeholder="Amount to stake"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select
        className="input-field"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      >
        <option value="">Select Lock Duration</option>
        <option value={21 * 86400}>21 Days</option>
        <option value={3 * 30 * 86400}>3 Months</option>
        <option value={6 * 30 * 86400}>6 Months</option>
        <option value={12 * 30 * 86400}>12 Months</option>
      </select>

      <button
        onClick={handleApprove}
        className="glow-button"
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Approve'}
      </button>

      <button
        onClick={handleStake}
        className="glow-button"
        disabled={!isApproved || isLoading}
      >
        {isLoading ? 'Processing...' : 'Stake'}
      </button>

      <p className="status-text">{status}</p>
    </div>
  );
}