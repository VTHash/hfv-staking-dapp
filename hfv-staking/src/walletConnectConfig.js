import { Web3Modal } from '@web3modal/react'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { configureChains, createConfig } from 'wagmi'
import { mainnet } from 'wagmi/chains'

export const projectId = '93fec723c6a3e456a04e6e949b271056' // ✅ HFV WalletConnect project ID

const chains = [mainnet]

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})

export const ethereumClient = new EthereumClient(wagmiConfig, chains)
export { Web3Modal }