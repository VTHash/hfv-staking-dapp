import React from "react";
import { useChainId, useAccount } from "wagmi";
import './LogoStyles.css';
const NetworkBanner = () => {
  const chainId = useChainId();
  const { isConnected } = useAccount();

  const supportedChainId = 1; // Ethereum Mainnet
  const chainName = chainId === 1 ? "Ethereum Mainnet" : `Chain ID ${chainId}`;
  const isCorrectNetwork = isConnected && chainId === supportedChainId;

  return (
    <div className={`w-full text-center py-3 text-sm font-medium ${
      isCorrectNetwork ? 'bg-green-700 text-white' : 'bg-red-600 text-white'
    }`}>
      {isConnected ? (
        isCorrectNetwork ? (
          <>✅ Connected to {chainName}</>
        ) : (
          <>⚠️ Wrong Network: You're on {chainName}, switch to Ethereum Mainnet</>
        )
      ) : (
        <>🔴 Wallet Not Connected</>
      )}
    </div>
  );
};

export default NetworkBanner;