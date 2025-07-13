import { configureChains, createConfig, WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { http } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EthereumClient } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { walletConnect } from '@web3modal/wagmi'
const projectId = import.meta.env.VITE_PROJECT_ID;

const { chains, publicClient } = configureChains(
  [mainnet],
  [http()]
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
});

export const ethereumClient = new EthereumClient(wagmiConfig, chains);
export const queryClient = new QueryClient();

export { projectId, WagmiProvider, QueryClientProvider, Web3Modal };