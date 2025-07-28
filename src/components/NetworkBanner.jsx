import React, { useEffect, useState } from 'react';
import { BrowserProvider } from 'ethers';

export default function NetworkBanner() {
  const [network, setNetwork] = useState(null);
  const [wrongNetwork, setWrongNetwork] = useState(false);

  useEffect(() => {
    const checkNetwork = async () => {
      if (!window.ethereum) return;

      try {
        const provider = new BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        setNetwork(network);
        setWrongNetwork(network.chainId !== 1);
      } catch (err) {
        console.error('Error fetching network:', err);
      }
    };

    checkNetwork();

    // Update on chain change
    window.ethereum?.on('chainChanged', () => window.location.reload());

    return () => {
      window.ethereum?.removeListener('chainChanged', () => {});
    };
  }, []);

  if (!network) return null;

  return (
    <div className={`network-banner ${wrongNetwork ? 'wrong' : 'correct'}`}>
      {wrongNetwork ? (
        <p>
          ⚠️ You are connected to <strong>{network.name}</strong> (chainId {network.chainId}). Please switch to Ethereum Mainnet.
        </p>
      ) : (
        <p>
          ✅ Connected to Ethereum Mainnet (chainId 1)
        </p>
      )}
    </div>
  );
}