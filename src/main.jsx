import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { Web3Modal } from '@web3modal/react' 
import { wagmiConfig } from './wagmiConfig'
import App from './App'

const projectId = import.meta.env.VITE_PROJECT_ID

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <App />
    </WagmiProvider>
    <Web3Modal projectId={projectId} />
  </React.StrictMode>
)