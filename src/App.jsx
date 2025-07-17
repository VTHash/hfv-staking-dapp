import { createAppKit } from '@reown/appkit/react'
import { wagmiAdapter, networks } from './wagmiConfig'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const metadata = {
  name: 'HFV Protocol',
  description: 'Staking Protocol',
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
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>🔥 HFV DApp Loaded Successfully</h1>
    <p>If you're seeing this, the app is loading correctly!</p>
    <p>We will re-enable wallet connect in the next step.</p>
  </div>
);
}