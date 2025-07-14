import { http } from 'viem';
import { configureChains, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';

const { chains, publicClient } = configureChains(
  [mainnet],
  [http()]
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
});