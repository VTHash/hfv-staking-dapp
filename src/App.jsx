import './index.css';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from './wagmiConfig';
import StakingDashboard from './components/StakingDashboard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <StakingDashboard />
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default App;