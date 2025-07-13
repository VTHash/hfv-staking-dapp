import { WagmiConfig } from 'wagmi';
import { Web3Modal } from '@web3modal/react';
import { wagmiConfig } from './wagmiConfig';
import { projectId, ethereumClient } from './web3modalConfig';
import ConnectWalletButton from './components/ConnectWalletButton';
import StakeForm from './components/StakeForm';
import RewardCalculator from './components/RewardCalculator';
import ClaimButton from './components/ClaimButton';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <div className="App">
        <h1>HFV Staking DApp</h1>
        <ConnectWalletButton />
        <StakeForm />
        <RewardCalculator />
        <ClaimButton />
        <AnalyticsDashboard />
      </div>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </WagmiConfig>
  );
}

export default App;