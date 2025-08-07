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
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isStaking, setIsStaking] = useState(false);

  const connectProvider = async () => {
    if (window.ethereum) {
      return new BrowserProvider(window.ethereum);
    } else {
      const walletConnectProvider = await EthereumProvider.init({
        projectId: import.meta.env.VITE_PROJECT_ID,
        chains: [1],
        showQrModal: true,
        methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData'],
      });
      return new BrowserProvider(walletConnectProvider);
    }
  };

  const handleApprove = async () => {
    if (!amount || !tokenAddress || !stakingAddress) return;

    try {
      setIsApproving(true);
      setStatus('🔄 Approving HFV...');

      const provider = await connectProvider();
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      const amountInWei = ethers.parseUnits(amount, 18);

      const tx = await tokenContract.approve(stakingAddress, amountInWei);
      await tx.wait();

      setIsApproved(true);
      setStatus('✅ Approval successful! You can now stake.');
    } catch (err) {
      console.error('Approval Error:', err);
      setStatus(`❌ Approval failed: ${err?.reason || err?.message || 'Unknown error'}`);
    } finally {
      setIsApproving(false);
    }
  };

 const handleStake = async () => {
  if (isLoading || !stakingAddress || !tokenAddress || !amount || !duration) return;

  setIsLoading(true);

  try {
    const stakeAmount = parseFloat(amount);
    if (stakeAmount > 500) {
      setStatus('❌ Max 500 HFV per period');
      setIsLoading(false);
      return;
    }

    setStatus('🔄 Connecting...');

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
    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
    const stakingContract = new ethers.Contract(stakingAddress, stakingAbi, signer);
    const amountInWei = ethers.parseUnits(amount, 18);

    // ✅ Step 1: Approve
    try {
      setStatus('📝 Approving HFV...');
      const approvalTx = await tokenContract.approve(stakingAddress, amountInWei);
      console.log("🔄 Approval tx sent:", approvalTx.hash);
      await approvalTx.wait();
      console.log("✅ Approval confirmed:", approvalTx.hash);
    } catch (err) {
      console.error("❌ Approval error:", err);
      setStatus(`❌ Approval failed: ${err?.reason || err?.message}`);
      setIsLoading(false);
      return;
    }

    // ✅ Step 2: Stake
    try {
      setStatus('⏳ Staking in progress...');
      const stakeTx = await stakingContract.stake(amountInWei, Number(duration));
      console.log("🔄 Stake tx sent:", stakeTx.hash);
      await stakeTx.wait();
      console.log("✅ Stake confirmed:", stakeTx.hash);

      setStatus('✅ Stake successful!');
      setAmount('');
      setDuration('');
    } catch (err) {
      console.error("❌ Stake error:", err);
      setStatus(`❌ Stake failed: ${err?.reason || err?.message}`);
    }
  } catch (err) {
    console.error("❌ Unknown error:", err);
    setStatus(`❌ Failed: ${err?.reason || err?.message || 'Unknown error'}`);
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

      <button className="glow-button" onClick={handleApprove} disabled={isApproving}>
        {isApproving ? 'Approving...' : 'Approve'}
      </button>

      <button
        className="glow-button"
        onClick={handleStake}
        disabled={!isApproved || isStaking}
      >
        {isStaking ? 'Staking...' : 'Stake'}
      </button>

      <p className="status-text">{status}</p>
    </div>
  );
}
