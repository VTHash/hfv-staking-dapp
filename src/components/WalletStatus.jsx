import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export default function WalletStatus() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    const fetchWalletInfo = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        const userBalance = await provider.getBalance(userAddress);

        setAddress(userAddress);
        setBalance(ethers.utils.formatEther(userBalance));
      }
    };

    fetchWalletInfo();
  }, []);

  if (!address) return null;

  return (
    <div className="glow-frame" style={{ marginTop: '2rem' }}>
      <h2 style={{ color: '#0ff' }}>👛 Wallet Info</h2>
      <p style={{ color: '#ccc' }}>
        <strong>Address:</strong> {address.slice(0, 6)}...{address.slice(-4)}
      </p>
      <p style={{ color: '#ccc' }}>
        <strong>Balance:</strong> {balance} ETH
      </p>
    </div>
  );
}
