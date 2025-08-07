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
  const [isStaking, setIsStaking] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    let prov;
    if (window.ethereum) {
      prov = new BrowserProvider(window.ethereum);
    } else {
      const walletConnect = await EthereumProvider.init({
        projectId: import.meta.env.VITE_PROJECT_ID,
        chains: [1],
        showQrModal: true,
        methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData'],
      });
      prov = new BrowserProvider(walletConnect);
    }

    const accounts = await prov.send("eth_accounts", []);
    if (accounts.length === 0) {
      await prov.send("eth_requestAccounts", []);
    }

    const sgnr = await prov.getSigner();
    setProvider(prov);
    setSigner(sgnr);
    return sgnr;
  };

  const handleApprove = async () => {
    if (!amount || parseFloat(amount) > 500) {
      setStatus('❌ Amount required and max 500 HFV per period');
      return;
    }

    try {
      setIsApproving(true);
      setStatus('🔄 Connecting wallet...');
      const sgnr = await connectWallet();

      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, sgnr);
      const amountInWei = ethers.parseUnits(amount, 18);

      setStatus('📝 Sending approval transaction...');
      const tx = await tokenContract.approve(stakingAddress, amountInWei);
      await tx.wait();

      setStatus('✅ Approval successful. You can now stake.');
    } catch (err) {
      console.error("Approve Error:", err);
      setStatus(`❌ Approve failed: ${err?.reason || err?.message}`);
    } finally {
      setIsApproving(false);
    }
  };

  const handleStake = async () => {
    if (!amount || !duration || parseFloat(amount) > 500) {
      setStatus('❌ Amount and duration required (Max 500 HFV)');
      return;
    }

    try {
      setIsStaking(true);
      setStatus('🔄 Preparing to stake...');

      const amountInWei = ethers.parseUnits(amount, 18);
      const stakingContract = new ethers.Contract(stakingAddress, stakingAbi, signer);

      setStatus('🚀 Sending stake transaction...');
      const tx = await stakingContract.stake(amountInWei, Number(duration));
      await tx.wait();

      setStatus('✅ Stake successful!');
      setAmount('');
      setDuration('');
    } catch (err) {
      console.error("Stake Error:", err);
      setStatus(`❌ Stake failed: ${err?.reason || err?.message}`);
    } finally {
      setIsStaking(false);
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
        className="glow-button"
        onClick={handleApprove}
        disabled={isApproving || isStaking}
      >
        {isApproving ? 'Approving...' : 'Approve'}
      </button>

      <button
        className="glow-button"
        onClick={handleStake}
        disabled={isStaking || isApproving}
      >
        {isStaking ? 'Staking...' : 'Stake'}
      </button>

      <p className="status-text">{status}</p>
    </div>
  );
}