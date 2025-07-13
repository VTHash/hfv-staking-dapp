import React from 'react';
import {
  wagmiConfig,
  ethereumClient,
  projectId,
  WagmiProvider,
  QueryClientProvider,
  queryClient,
  Web3Modal
} from './wagmiConfig';

import ConnectWalletButton from './components/ConnectWalletButton';
import StakeForm from './components/StakeForm';
import RewardCalculator from './components/RewardCalculator';
import ClaimButton from './components/ClaimButton';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <h1>HFV Staking DApp</h1>
          <ConnectWalletButton />
          <StakeForm />
          <RewardCalculator />
          <ClaimButton />
          <AnalyticsDashboard />
        </div>
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;