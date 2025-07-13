import React from "react";
import { WagmiConfig } from "wagmi";
import { Web3Modal } from "@web3modal/react";
import wagmiConfig from "./wagmiConfig";
import { projectId, ethereumClient } from "./web3modalConfig";
import ConnectWalletButton from "./components/ConnectWalletButton";
import StakeForm from "./components/StakeForm";

export default function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      <div className="mt-10">
        <ConnectWalletButton />
        <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto text-center">
          Choose your lock duration and earn rewards
        </p>
        <StakeForm />
      </div>
    </WagmiConfig>
  );
}