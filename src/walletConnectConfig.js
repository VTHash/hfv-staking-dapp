import { configureChains, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect';
import { InjectedConnector } from '@wagmi/core/connectors/injected';

const projectId = '93fec723c6a3e456a04e6e949b271056'; // ✅ HFV Staking official WC Project ID

const { chains, publicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
        showQrModal: true,
      },
    }),
  ],
  publicClient,
});