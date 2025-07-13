import { configureChains, createConfig,mainnet } from 'wagmi';
import { publicProvider } from '@wagmi/providers/public';
import { injected, walletConnect } from 'wagmi/connectors';

// Set up supported chains and providers
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

// Create wagmi client configuration
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    injected(),
    walletConnect({
      projectId: import.meta.env.VITE_WC_PROJECT_ID ?? '',
    }),
  ],
  publicClient,
  webSocketPublicClient,
});