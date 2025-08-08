import React, { useState } from 'react';
import { ethers, BrowserProvider, Interface } from 'ethers';
import EthereumProvider from '@walletconnect/ethereum-provider';
import HFVStaking from '../abi/HFVStaking.json';
import HFVToken from '../abi/HFVToken.json';
import WalletToggle from 'src/WalletToggle.jsx'; 

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
  const [walletType, setWalletType] = useState('metamask');

  const connectProvider = async () => {
    if (walletType === 'metamask') {
      await window.ethereum.request({ method: 'eth_requestAccounts' }); // ✅ Ensure only called once
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

      const amountInWei = BigInt(amount); // ⚠️ Assuming HFV token has 0 decimals
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
    if (isLoading) return;
    if (!stakingAddress || !tokenAddress || !amount || !duration) {
      setStatus("❌ Please fill all fields");
      return;
    }

    setIsLoading(true);
    setStatus('🔄 Preparing stake...');

    try {
      const provider = await connectProvider();
      const signer = await provider.getSigner();

      const iface = new Interface(stakingAbi); // ✅ Correct import
      const amountInWei = BigInt(amount);
      const data = iface.encodeFunctionData("stake", [amountInWei, Number(duration)]);

      const tx = await signer.sendTransaction({
        to: stakingAddress,
        data: data,
      });

      await tx.wait();

      setStatus("✅ Stake successful!");
      setAmount('');
      setDuration('');
    } catch (err) {
      console.error("Stake error:", err);
      setStatus(`❌ Stake failed: ${err.reason || err.message}`);
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

      <WalletToggle onSelect={setWalletType} />

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