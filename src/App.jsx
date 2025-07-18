console.log('APP RENDERED');
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { wagmiConfig } from './wagmiConfig';
import StakingDashboard from './components/StakingDashboard';

const queryClient = new QueryClient();
const appKitModal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId: import.meta.env.VITE_PROJECT_ID,
  metadata: {},
});

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
