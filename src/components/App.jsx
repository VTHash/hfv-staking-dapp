 import React from 'react'; 
 import ConnectWallet from './components/ConnectWallet'; 
 import StakeForm from './components/StakeForm'; 
 import StakingDashboard from './components/StakingDashboard'; 
 import RewardCalculator from './components/RewardCalculator';
 import NetworkBanner from './components/NetworkBanner';
 import WalletStatus from  './components/WalletStatus';
 import Claim from './components/Claim'; 
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