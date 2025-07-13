import { configureChains, createConfig, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { injected, walletConnect } from 'wagmi/connectors'

// Setup chains and public provider
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()],
)

// Create Wagmi config with connectors
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    injected(), // Injected (e.g. MetaMask) connector
    walletConnect({
      projectId: process.env.WC_PROJECT_ID ?? '', // Must be a valid WalletConnect v2 ID
    }),
  ],
  publicClient,
  webSocketPublicClient,
})