import React from "react";
import { WagmiConfig } from 'wagmi'
import { wagmiConfig } from './wagmiConfig'
import ConnectWalletButton from './ConnectWalletButton'

export default function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectWalletButton />
  )
}
    <div className="min-h-screen bg-black text-green-400">
      <img
        src="/hfv-logo.png"
        alt="HFV Logo"
        className="w-20 h-20 mx-auto mt-8 animate-pulse drop-shadow-md"
      />
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
  Stake Your HFV Tokens ✅
</h1>
      <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto text-center">
        Choose your lock duration and earn rewards
      </p>

      <WagmiConfig config={wagmiConfig}>
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        <ConnectWalletButton />
        <StakeForm />
      </WagmiConfig>
    </div>
  );
}