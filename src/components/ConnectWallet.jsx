import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ConnectWallet = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
      } catch (err) {
        console.error('Wallet connection failed:', err);
        alert('Wallet connection failed');
      }
    } else {
      alert('MetaMask not detected');
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => connectWallet());
    }
  }, []);

  return (
    <div className="glow-frame" style={{ display: 'inline-block', marginTop: '1rem' }}>
      <button className="wallet-btn" onClick={connectWallet}>
        {account ? `✅ Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : '🔌 Connect Wallet'}
      </button>
    </div>
  );
};

export default ConnectWallet;