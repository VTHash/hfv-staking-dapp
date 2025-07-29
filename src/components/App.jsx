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
      <div className="app-header">
        <img src="/hfv-logo.png" alt="HFV Logo" className="logo" />
        <h1 className="hud-title">HFV Staking DApp</h1>
      </div>

      <div className="hud-frame">
        <ConnectWallet />
      </div>

      <div className="hud-frame">
        <NetworkBanner />
      </div>

      <div className="hud-frame">
        <StakeForm />
      </div>

      <div className="hud-frame">
        <StakingDashboard />
      </div>

      <div className="hud-frame">
        <Claim />
      </div>

      <div className="hud-frame">
        <RewardCalculator />
      </div>

      <div className="hud-frame">
        <WalletStatus />
      </div>
    </div>
  );
};

export default App;
