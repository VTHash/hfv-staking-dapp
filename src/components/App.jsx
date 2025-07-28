 import React from 'react'; 
 import ConnectWallet from './ConnectWallet'; 
 import StakeForm from './StakeForm'; 
 import StakingDashboard from './StakingDashboard'; 
 import RewardCalculator from './RewardCalculator';
 import NetworkBanner from './NetworkBanner';
 import WalletStatus from  './WalletStatus';
 import Claim from './ClaimHFV'; 
 import '../index.css';

const App = () => { 
  return (
  <div className="app-container">
    <h1>HFV Staking DApp</h1>
    <ConnectWallet />
    <NetworkBanner />
    <StakeForm />
    <StakingDashboard />
    <Claim />
    <RewardCalculator />
    <WalletStatus />
  </div>
  );
};

export default App;