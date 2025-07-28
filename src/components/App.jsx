 import React from 'react'; 
 import ConnectWallet from './ConnectWallet'; 
 import StakeForm from './StakeForm'; 
 import StakingDashboard from './StakingDashboard'; 
 import RewardCalculator from './RewardCalculator';
 import NetworkBanner from './NetworkBanner';
 import WalletStatus from  './WalletStatus';
 import Claim from './Claim'; 
 import './index.css';

const App = () => { 
  return ( <div className="app-container"> 
  <header className="header"> 
    <h1>HFV Staking DApp</h1> 
    <ConnectWallet />
     </header>

<main className="main-content">
    <StakeForm />
    <StakingDashboard />
    <RewardCalculator />
  </main>
</div>

); };

export default App;