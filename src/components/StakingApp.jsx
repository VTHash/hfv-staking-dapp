import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { mainnet } from '@reown/appkit/networks';
import { wagmiConfig } from '../wagmiConfig';

import ConnectWalletButton from './LaunchDapp';
import StakeForm from '../components/StakeForm';
import RewardCalculator from '../components/RewardCalculator';
import ClaimButton from '../components/ClaimButton';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

const queryClient = new QueryClient();
const projectId = import.meta.env.VITE_PROJECT_ID;

const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [mainnet]
});

const AppKitProvider = createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet],
  projectId
});

export default function StakingApp() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AppKitProvider>
          <div className="App">
            <ConnectWalletButton />
            <StakeForm />
            <RewardCalculator />
            <ClaimButton />
            <AnalyticsDashboard />
          </div>
        </AppKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}