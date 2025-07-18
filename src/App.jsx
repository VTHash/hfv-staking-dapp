import React from 'react';
import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';

import { wagmiConfig, wagmiAdapter, networks } from './wagmiConfig';
import StakingDashboard from './components/StakingDashboard';
import './index.css';

const metadata = {
  name: 'HFV Protocol',
  description: 'Staking Protocol',
  url: window.location.origin,
  icons: ['./icon.png'],
};

const appKitModal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId: import.meta.env.VITE_PROJECT_ID,
  metadata,
});

const queryClient = new QueryClient();

function App() {
  console.log('APP RENDERED');

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <appKitModal.Provider>
          <div className="app-container">
            <StakingDashboard />
          </div>
        </appKitModal.Provider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}

export default App;