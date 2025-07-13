import { EthereumClient } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { wagmiConfig } from './components/wagmiConfig';
import { mainnet } from 'wagmi/chains';

const chains = [mainnet];
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
)

// Get WallettConnect Project ID from .env
export const projectId = process.env.WC_PROJECT_ID;

// Setup the Ethereum client for Web3Modal
export const ethereumClient = new EthereumClient(wagmiConfig, chains);