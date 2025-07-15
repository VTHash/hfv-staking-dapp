import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum } from '@reown/appkit/networks'

const projectId = import.meta.env.VITE_PROJECT_ID
if (!projectId) throw new Error('VITE_PROJECT_ID is not defined')

export const networks = [mainnet, arbitrum]

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
  storage: createStorage({ storage: cookieStorage }),
  transports: {
    // optional: customize RPC, e.g. for mainnet
    [mainnet.id]: http(),
    [arbitrum.id]: http()
  }
})

export const wagmiConfig = wagmiAdapter.wagmiConfig