import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  connectors: [
    injected(), // Metamask
  ],
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});