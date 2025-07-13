import { EthereumClient } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { wagmiConfig } from './components/wagmiConfig';
import { mainnet } from 'wagmi/chains';

const chains = [mainnet];

export const projectId = import.meta.env.VITE_WC_PROJECT_ID;
export const ethereumClient = new EthereumClient(wagmiConfig, chains);