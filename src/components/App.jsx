import React from 'react';
import ConnectWallet from './ConnectWallet';
import StakeForm from './StakeForm';
import StakingDashboard from './StakingDashboard';
import Claim from './ClaimHFV';
import '../index.css';
import { WalletProvider } from './WalletContext'; 

const App = () => {
  return (
    <WalletProvider>
    <div className="app-glow-frame">
      <div className="hud-container">
       <div className="app-wrapper">   
      <div className="app-header logo-title-wrapper">
        <img src="/hfv-logo.png" alt="HFV Logo" className="logo pulsate-logo" />
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


        <div className="glow-frame" style={{ textAlign: "center", marginTop: "2rem" }}>
  <p style={{ color: "#00ffae", fontWeight: "bold", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
    Powered by Etherscan
  </p>
  <a
    href="https://etherscan.io/address/0x46E7007d6515B4f260f3CbC82f4672622eace802"
    target="_blank"
    rel="noopener noreferrer"
  >
    <img
      src="https://etherscan.io/images/brandassets/etherscan-logo-light-circle.png"
      alt="Etherscan Logo"
      className="etherscan-logo"
    />
  </a>
</div>

        </div>
        </div>
      
      </div>
    </div>
</WalletProvider>
  );
};

export default App;

  

