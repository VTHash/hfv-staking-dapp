import React, { useEffect, useState } from 'react';

export default function NetworkBanner() {
  const [chainId, setChainId] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_chainId' }).then((id) => {
        setChainId(parseInt(id, 16));
      });

      window.ethereum.on('chainChanged', (id) => {
        setChainId(parseInt(id, 16));
      });
    }
  }, []);

  const isCorrectNetwork = chainId === 1;

  return (
    <div className="glow-frame status-text">
      {chainId ? (
        isCorrectNetwork ? (
          <span>✅ Connected to Ethereum Mainnet</span>
        ) : (
          <span style={{ color: 'orange' }}>⚠️ Wrong network! Please switch to Ethereum Mainnet</span>
        )
      ) : (
        <span>🔌 Connecting to network...</span>
      )}
    </div>
  );
}
