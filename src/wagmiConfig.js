import { WagmiProvider, configureChains, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { walletConnectProvider } from '@web3modal/wagmi'

const projectId = import.meta.env.VITE_PROJECT_ID

const { publicClient } = configureChains(
  [mainnet],
  [
    walletConnectProvider({ projectId }),
    publicProvider()
  ]
)

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient
})