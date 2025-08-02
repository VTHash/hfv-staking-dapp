import React from 'react';
import ConnectWallet from './ConnectWallet';
import StakeForm from './StakeForm';
import StakingDashboard from './StakingDashboard';
import RewardCalculator from './RewardCalculator';
import Claim from './ClaimHFV';
import '../index.css';

const App = () => {
  return (
       <div className="app-wrapper">   
      <div className="app-header logo-title-wrapper">
        <img src="/hfv-logo.png" alt="HFV Logo" className="logo" />
        <h1 className="app-title">HFV Staking DApp</h1>
      </div>

      <div className="badge-row">
  <a href="https://app.dentity.com/andreihabliuc.eth" target="_blank" rel="noopener noreferrer">
    <img src="/dentity-logo.png" alt="Dentity Verified" className="badge-icon" />
  </a>
  <a href="https://onboarding.lens.xyz/handle/hfvprotocol" target="_blank" rel="noopener noreferrer">
    <img src="/lens-logo.png" alt="Lens Profile" className="badge-icon" />
  </a>
  <a href="https://app.ens.domains/name/andreihabliuc.eth" target="_blank" rel="noopener noreferrer">
    <img src="/ens-logo.png" alt="ENS Profile" className="badge-icon" />
  </a>
</div>

      <div className="main-content">
        <div className="glow-frame">       
            <ConnectWallet />
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

        </div>
      </div>
    
  );
};

export default App;
