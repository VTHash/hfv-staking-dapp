import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

export default function NetworkBanner() {
  const [chainId, setChainId] = useState(null);

  useEffect(() => {
    async function getChainId() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        setChainId(network.chainId);
      }
    }

    getChainId();

    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
  }, []);

  if (chainId === 1) return null;

  return (
    <div style={{ backgroundColor: '#ff0055', color: '#fff', padding: '0.5rem', textAlign: 'center' }}>
      ⚠ Please switch to Ethereum Mainnet to use HFV Staking DApp
    </div>
  );
}