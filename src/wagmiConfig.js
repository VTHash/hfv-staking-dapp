import { http } from 'viem';
import { configureChains, createConfig } from '@wagmi/core';
import { mainnet } from 'wagmi/chains';

const { chains, publicClient } = configureChains(
  [mainnet],
  [http()]
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
});