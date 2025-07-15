import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { wagmiAdapter, networks } from '../wagmiConfig';

const metadata = {
  name: 'HFV DApp',
  description: 'Staking interface for HFV',
  url: window.location.origin,
  icons: ['/logo.png'],
};

const appKitModal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId: import.meta.env.VITE_PROJECT_ID,
  metadata,
});

const queryClient = new QueryClient();

export default function StakingApp() {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div style={{ color: 'limegreen', textAlign: 'center', marginTop: '5rem' }}>
          <h1>Staking Page Loaded ✅</h1>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
