import React, { useState } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import EthereumProvider from '@walletconnect/ethereum-provider';
import HFVStaking from '../abi/HFVStaking.json';
import WalletToggle from './WalletToggle.jsx';
const stakingAbi = HFVStaking.abi;
const stakingAddress = import.meta.env.VITE_HFV_STAKING_ADDRESS;
const projectId = import.meta.env.VITE_PROJECT_ID;

export default function ClaimHFV() {
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
const [walletType, setWalletType] = useState('metamask');
  const connectProvider = async () => {
  if (walletType === 'metamask') {
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


  const handleClaim = async () => {
    setIsLoading(true);
    setStatus('🔄 Connecting wallet...');

    try {
      const provider = await connectProvider();
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const stakingContract = new ethers.Contract(stakingAddress, stakingAbi, signer);

      const stakeCount = await stakingContract.getStakeCount(userAddress);
      if (stakeCount === 0) {
        setStatus('❌ No stakes found.');
        setIsLoading(false);
        return;
      }

      let claimedAny = false;

      for (let i = 0; i < stakeCount; i++) {
        const reward = await stakingContract.getPendingReward(userAddress, i);
        if (reward > 0n) {
          setStatus(`⚡ Claiming stake #${i}...`);
          const tx = await stakingContract.claim(i);
          await tx.wait();
          claimedAny = true;
        }
      }

      setStatus(claimedAny ? '✅ Rewards claimed!' : 'ℹ️ Nothing claimable.');
    } catch (err) {
      console.error('Claim Error:', err);
      setStatus(`❌ Claim failed: ${err.reason || err.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="claim-hfv">
      <h3 className="section-title">Claim Available Rewards</h3>
      <button className="glow-button" onClick={handleClaim} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Claim'}
      </button>
      <p className="status-text">{status}</p>
    </div>
  );
}