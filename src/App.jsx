import { createAppKit } from '@reown/appkit/react'
import { wagmiAdapter, networks } from './wagmiConfig'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const metadata = {
  name: 'Your DApp',
  description: 'Describe your app',
  url: window.location.origin,
  icons: ['…/icon.png']
}

const appKitModal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId: import.meta.env.VITE_PROJECT_ID,
  metadata
})

function App() {
  const queryClient = new QueryClient()

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {/* Your app */}
        <button onClick={() => appKitModal.open()}>Connect Wallet</button>
      </QueryClientProvider>
    </WagmiProvider>
  )
}