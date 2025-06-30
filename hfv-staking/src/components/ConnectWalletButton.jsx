import React from "react";
import { configureChains, createConfig, WagmiConfig, useAccount, useConnect, useDisconnect } from "wagmi";
import { polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { Web3Modal } from "@web3modal/react";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";

const projectId = "YOUR_PROJECT_ID"; // Replace this with your actual WalletConnect Project ID

const chains = [polygon];

const { publicClient } = configureChains(chains, [w3mProvider({ projectId }), publicProvider()]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: "1", chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

function WalletUI() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="text-green-300 font-semibold space-y-2">
        <p>Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>
        <button onClick={() => disconnect()} className="bg-red-500 px-4 py-2 rounded">Disconnect</button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="bg-green-400 text-black px-6 py-2 rounded hover:bg-green-300 transition"
    >
      Connect Wallet
    </button>
  );
}

export default function ConnectWalletButton() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <WalletUI />
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </WagmiConfig>
  );
}

