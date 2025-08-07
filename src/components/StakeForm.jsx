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

  const handleStake = async () => {
    if (isLoading) return;
    if (!stakingAddress || !tokenAddress || !amount || !duration) return;

    setIsLoading(true);
    try {
      const stakeAmount = parseFloat(amount);
      if (isNaN(stakeAmount) || stakeAmount <= 0) {
        setStatus('❌ Invalid amount');
        setIsLoading(false);
        return;
      }

      const amountInWei = ethers.parseUnits(amount, 18);
      setStatus('🔄 Connecting...');

      let provider;
      if (window.ethereum) {
        provider = new BrowserProvider(window.ethereum);
      } else {
        const walletConnect = await EthereumProvider.init({
          projectId: import.meta.env.VITE_PROJECT_ID,
          chains: [1],
          showQrModal: true,
          methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData'],
        });
        provider = new BrowserProvider(walletConnect);
      }

      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
      const stakingContract = new ethers.Contract(stakingAddress, stakingAbi, signer);

      const alreadyStaked = await stakingContract.getStakedAmount(userAddress, Number(duration));
      const totalStaked = alreadyStaked + amountInWei;

      if (totalStaked > ethers.parseUnits("500", 18)) {
        setStatus('❌ Max 500 HFV per period per wallet');
        setIsLoading(false);
        return;
      }

      const currentAllowance = await tokenContract.allowance(userAddress, stakingAddress);
      if (currentAllowance < amountInWei) {
        setStatus('📝 Approving HFV...');
        const approvalTx = await tokenContract.approve(stakingAddress, amountInWei);
        await approvalTx.wait();
      }

      setStatus('⏳ Staking in progress...');
      const stakeTx = await stakingContract.stake(amountInWei, Number(duration));
      await stakeTx.wait();

      setStatus('✅ Stake successful!');
      setAmount('');
      setDuration('');
    } catch (err) {
      console.error('Stake Error:', err);
      setStatus(`❌ Stake failed: ${err?.reason || err?.message || JSON.stringify(err)}`);
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
      <button className="glow-button" onClick={handleStake} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Stake'}
      </button>
      <p className="status-text">{status}</p>
    </div>
  );
}