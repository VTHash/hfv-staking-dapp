import './index.css';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from './walletConnectConfig';
import ConnectWalletButton from './components/ConnectWalletButton';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <ConnectWalletButton />
        </div>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default App;
