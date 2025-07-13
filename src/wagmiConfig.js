import { configureChains, createConfig } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { InjectedConnector } from 'wagmi/connectors/injected';

const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
      }),
    }),
  ]
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector(),
    new WalletConnectConnector({
      options: {
        projectId: process.env.WC_PROJECT_ID ?? '',
        showQrModal: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});