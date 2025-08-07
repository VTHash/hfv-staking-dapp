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
  const [isLoading, setIsLoading] = useState(false);

  const getProviderAndSigner = async () => {
    let provider;
    if (window.ethereum) {
      provider = new BrowserProvider(window.ethereum);
    } else {
      provider = await EthereumProvider.init({
        projectId: import.meta.env.VITE_PROJECT_ID,
        chains: [1],
        showQrModal: true,
        methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData'],
      });
      provider = new BrowserProvider(provider);
    }
    const signer = await provider.getSigner();
    return { provider, signer };
  };

  const handleApprove = async () => {
    if (!tokenAddress || !stakingAddress || !amount) return;
    setIsLoading(true);
    setStatus('📝 Approving HFV...');
    try {
      const { signer } = await getProviderAndSigner();
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      const amountInWei = ethers.parseUnits(amount, 18);
      const tx = await tokenContract.approve(stakingAddress, amountInWei);
      await tx.wait();
      setStatus('✅ Approved HFV tokens for staking.');
    } catch (err) {
      console.error('Approval Error:', err);
      setStatus(`❌ Approval failed: ${err?.reason || err?.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStake = async () => {
    if (!stakingAddress || !amount || !duration) return;
    setIsLoading(true);
    setStatus('⏳ Staking in progress...');
    try {
      const { signer } = await getProviderAndSigner();
      const stakingContract = new ethers.Contract(stakingAddress, stakingAbi, signer);
      const amountInWei = ethers.parseUnits(amount, 18);
      const tx = await stakingContract.stake(amountInWei, Number(duration));
      await tx.wait();
      setStatus('✅ Stake successful!');
      setAmount('');
      setDuration('');
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

      <button onClick={handleApprove} className="glow-button" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Approve'}
      </button>
      <button onClick={handleStake} className="glow-button" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Stake'}
      </button>

      <p className="status-text">{status}</p>
    </div>
  );
}
