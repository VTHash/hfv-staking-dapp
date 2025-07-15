import { http } from 'viem';
import { createConfig } from '@wagmi/core';
import { mainnet } from 'wagmi/chains';
import { walletConnect, injected } from 'wagmi/connectors';
export const config = createConfig({
  chains: [mainnet],
    transports: {
        [mainnet.id]: http(),
          },
            connectors: [
                injected({ shimDisconnect: true }),
                    walletConnect({
                          projectId: '93fec723c6a3e456a04e6e949b271056', // ✅ Your WalletConnect project ID
                                showQrModal: true,
                                    }),
                                      ],
                                      });

                                      