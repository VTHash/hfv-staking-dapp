import React, { useState } from "react";
import { ethers } from "ethers";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig, useAccount, useConnect, useDisconnect } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";

const projectId = "YOUR_WALLETCONNECT_PROJECT_ID"; // Replace with actual project ID from cloud.walletconnect.com

const chains = [polygon];
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: "1", chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function ConnectWalletButton() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </WagmiConfig>
  );
}

