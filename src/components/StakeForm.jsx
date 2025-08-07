import React, { useState } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import EthereumProvider from '@walletconnect/ethereum-provider';
import HFVStaking from '../abi/HFVStaking.json';
import HFVToken from '../abi/HFVToken.json';

const stakingAbi = HFVStaking.abi;
const tokenAbi = HFVToken.abi;

const stakingAddress = import.meta.env.VITE_HFV_STAKING_ADDRESS;
const tokenAddress = import.meta.env.VITE_HFV_TOKEN_ADDRESS;

export default function StakeForm() {
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const connectProvider = async () => {
    if (window.ethereum) {
      return new BrowserProvider(window.ethereum);
    }

    const wcProvider = await EthereumProvider.init({
      projectId: import.meta.env.VITE_PROJECT_ID,
      chains: [1],
      showQrModal: true,
      methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData'],
    });

    return new BrowserProvider(wcProvider);
  };

  const handleApprove = async () => {
    try {
      setStatus('📝 Approving...');
      const provider = await connectProvider();
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

      const amountInWei = ethers.parseUnits(amount, 18);
      const tx = await tokenContract.approve(stakingAddress, amountInWei);
      await tx.wait();

      setIsApproved(true);
      setStatus('✅ Approved. You can now stake.');
    } catch (err) {
      console.error('Approve Error:', err);
      setStatus(`❌ Approve failed: ${err?.reason || err?.message}`);
    }
  };

  const handleStake = async () => {
    if (!amount || !duration) return;
    setIsLoading(true);
    try {
      setStatus('🔄 Staking...');

      const provider = await connectProvider();
      const signer = await provider.getSigner();
      const stakingContract = new ethers.Contract(stakingAddress, stakingAbi, signer);

      const amountInWei = ethers.parseUnits(amount, 18);
      const tx = await stakingContract.stake(amountInWei, Number(duration));
      await tx.wait();

      setStatus('✅ Stake successful!');
      setAmount('');
      setDuration('');
      setIsApproved(false);
    } catch (err) {
      console.error('Stake Error:', err);
      setStatus(`❌ Stake failed: ${err?.reason || err?.message}`);
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

      <button onClick={handleApprove} className="glow-button">
        Approve
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