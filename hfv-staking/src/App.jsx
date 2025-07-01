// App.jsx import React from "react"; import ConnectWalletButton from "./components/ConnectWalletButton"; import StakeForm from "./components/StakeForm";

export default function App() { return ( <div className="min-h-screen bg-black text-green-400 p-6 text-center"> <img
src="/hfv-logo.png"
alt="HFV Logo"
className="w-20 h-20 mx-auto mb-6 animate-pulse drop-shadow-md"
/> <h1 className="text-4xl md:text-5xl font-bold mb-4">Stake Your HFV Tokens</h1> <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto"> Choose your staking duration and watch your rewards grow. Secure. Transparent. On-chain. </p> <ConnectWalletButton /> <StakeForm /> </div> ); }

// ConnectWalletButton.jsx import React from "react"; import { WagmiConfig, useAccount, useConnect, useDisconnect, configureChains, createConfig } from "wagmi"; import { polygon } from "wagmi/chains"; import { publicProvider } from "wagmi/providers/public"; import { Web3Modal } from "@web3modal/react"; import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";

const projectId = "93fec723c6a3e456a04e6e949b271056"; const chains = [polygon]; const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiConfig = createConfig({ autoConnect: true, connectors: w3mConnectors({ projectId, version: "1", chains }), publicClient, });

const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function ConnectWalletButton() { const { isConnected } = useAccount();

return ( <WagmiConfig config={wagmiConfig}> <Web3Modal projectId={projectId} ethereumClient={ethereumClient} /> {!isConnected && ( <button className="bg-green-400 text-black font-semibold py-2 px-6 rounded-lg shadow hover:bg-green-300 transition-all"> Connect Wallet </button> )} </WagmiConfig> ); }