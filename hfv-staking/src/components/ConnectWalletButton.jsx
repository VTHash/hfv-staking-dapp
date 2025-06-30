import React from 'react';
import { WagmiConfig, configureChains, createConfig, useAccount } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { w3mConnectors, w3mProvider, EthereumClient } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';

// ✅ Your WalletConnect Project ID
const projectId = '93fec723c6a3e456a04e6e949b271056';

// ✅ Configure chains and providers
const chains = [polygon];
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

// ✅ Wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

// ✅ Ethereum client for Web3Modal
const ethereumClient = new EthereumClient(wagmiConfig, chains);

// ✅ Actual wallet connect button component
function WalletStatus() {
  const { address, isConnected } = useAccount();

  return (
    <div className="text-white text-center">
      {isConnected ? (
        <p>Connected wallet: {address}</p>
      ) : (
        <p>Connect your wallet using the button below</p>
      )}
    </div>
  );
}

export default function ConnectWalletButton() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <WalletStatus />
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </WagmiConfig>
  );
}
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";