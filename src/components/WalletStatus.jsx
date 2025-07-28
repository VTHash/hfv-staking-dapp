import React, { useEffect, useState } from 'react';
import { BrowserProvider } from 'ethers';

export default function WalletStatus() {
  const [address, setAddress] = useState('');
  const [networkName, setNetworkName] = useState('');

  useEffect(() => {
    const loadWalletStatus = async () => {
      if (!window.ethereum) {
        setAddress('MetaMask not installed');
        return;
      }

      try {
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const addr = await signer.getAddress();
        const network = await provider.getNetwork();

        setAddress(addr);
        setNetworkName(network.name);
      } catch (err) {
        console.error('Failed to load wallet status:', err);
      }
    };

    loadWalletStatus();

    // Update on account or chain change
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => window.location.reload());
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };
  }, []);

  return (
    <div className="wallet-status">
      <p><strong>Wallet:</strong> {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}</p>
      <p><strong>Network:</strong> {networkName || 'Unknown'}</p>
    </div>
  );
}