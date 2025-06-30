import React from "react";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import {
  configureChains,
  createConfig,
  WagmiConfig,
  useAccount,
  useConnect,
  useDisconnect
} from "wagmi";
import { mainnet, polygon } from "wagmi/chains";

const projectId = "93fec723c6a3e456a04e6e949b271056"; // Your WalletConnect Project ID

const chains = [polygon, mainnet];
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: "1", chains }),
  publicClient
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <WagmiConfig config={wagmiConfig}>
      <div className="flex items-center justify-center flex-col mt-4">
        {isConnected ? (
          <>
            <div className="mb-2 text-sm">Connected: {address.slice(0, 6)}...{address.slice(-4)}</div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => disconnect()}
            >
              Disconnect Wallet
            </button>
          </>
        ) : (
          <button
            className="bg-green-500 text-black px-4 py-2 rounded"
            onClick={() => connect({ connector: connectors[0] })}
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* Wallet Modal */}
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </WagmiConfig>
  );
}
