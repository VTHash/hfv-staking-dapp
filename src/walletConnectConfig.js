import { mainnet } from 'viem/chains';
import { createConfig } from 'wagmi';
import { walletConnect } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [
    walletConnect({
      projectId: '93fec723c6a3e456a04e6e949b271056',
      showQrModal: true,
    }),
  ],
  ssr: false,
});