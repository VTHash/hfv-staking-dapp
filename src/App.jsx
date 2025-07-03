import React from "react";
import { WagmiConfig } from "wagmi";
import { Web3Modal } from "@web3modal/react";
import StakeForm from "./components/StakeForm";
import ConnectWalletButton from "./components/ConnectWalletButton";
import {
  wagmiConfig,
  ethereumClient,
  projectId,
} from "./walletConnectConfig";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-green-400">
      <img
        src="/hfv-logo.png"
        alt="HFV Logo"
        className="w-20 h-20 mx-auto mt-8 animate-pulse drop-shadow-md"
      />
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
        Stake Your HFV Tokens
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