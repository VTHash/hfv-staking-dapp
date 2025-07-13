import { configureChains, createConfig, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { injected, walletConnect } from 'wagmi/connectors'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
)

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    injected(), // Injected (e.g. MetaMask) connector
    walletConnect({
      projectId: import.meta.env.VITE.WC_PROJECT_ID ?? '',
    }),
  ],
  publicClient,
  webSocketPublicClient,
})