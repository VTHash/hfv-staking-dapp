import React from 'react';
import ConnectWallet from './ConnectWallet';
import StakeForm from './StakeForm';
import StakingDashboard from './StakingDashboard';
import RewardCalculator from './RewardCalculator';
import NetworkBanner from './NetworkBanner';
import WalletStatus from './WalletStatus';
import Claim from './ClaimHFV';
import '../index.css';

const App = () => {
  return (
       <div className="app-wrapper">   
      <div className="app-header logo-title-wrapper">
        <img src="/hfv-logo.png" alt="HFV Logo" className="logo" />
        <h1 className="app-title">HFV Staking DApp</h1>
      </div>

      <div className="main-content">
        <div className="glow-frame">       
    <Connect Wallet />
  </button>
</div>
            
          <ConnectWallet />
          <NetworkBanner />
        </div>

        <div className="glow-frame">
          <StakeForm />
        </div>

        <div className="glow-frame">
          <StakingDashboard />
        </div>

        <div className="glow-frame">
          <Claim />
        </div>

        <div className="glow-frame">
          <RewardCalculator />
        </div>

        <div className="glow-frame">
          <WalletStatus />
        </div>
      </div>
    </div>
  );
};

export default App;
