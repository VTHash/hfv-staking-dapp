import { http } from 'viem';
import { createConfig } from '@wagmi/core';
import { mainnet } from '@wagmi/chains';
import { walletConnect, injected } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
  connectors: [
    injected({ shimDisconnect: true }),
    walletConnect({
      projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
      showQrModal: true,
    }),
  ],
});
