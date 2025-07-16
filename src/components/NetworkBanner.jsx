import React from 'react';
import { useNetwork } from 'wagmi';

const NetworkBanner = () => {
  const { chain, isConnected } = useNetwork();

  const supportedChainId = 1; // Ethereum Mainnet
  const chainName = chain?.name || 'Unknown Network';

  const isCorrectNetwork = isConnected && chain?.id === supportedChainId;

  return (
    <div className={`w-full text-center py-3 text-sm font-medium ${
      isCorrectNetwork ? 'bg-green-700 text-white' : 'bg-red-600 text-white'
    }`}>
      {isConnected ? (
        isCorrectNetwork ? (
          <>✅ Connected to {chainName}</>
        ) : (
          <>⚠️ Wrong Network: You’re on {chainName}, switch to Ethereum Mainnet</>
        )
      ) : (
        <>🛑 Wallet Not Connected</>
      )}
    </div>
  );
};

export default NetworkBanner;