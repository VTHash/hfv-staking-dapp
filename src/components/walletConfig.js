import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet } from 'wagmi/chains'
import { http, createConfig } from 'wagmi'

export const walletConfig = () => {
  return createConfig(
    getDefaultConfig({
      appName: 'HFV Staking DApp',
      projectId: 'VITE_PROJECT_ID',
      chains: [mainnet],
      transports: {
        [mainnet.id]: http()
      }
    })
  )
}
