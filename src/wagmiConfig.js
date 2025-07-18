import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { createAppKitAdapter } from '@reown/appkit/wagmi';

export const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
  },
  ssr: false, // Disable SSR for Vite compatibility
});

export const wagmiAdapter = createAppKitAdapter(wagmiConfig);
export const networks = [mainnet];
