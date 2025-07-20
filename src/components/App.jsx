import React from 'react'
import ConnectWalletButton from './ConnectWalletButton'
import WalletStatus from './WalletStatus'
import NetworkBanner from './NetworkBanner'
import RewardCalculator from './RewardCalculator'
import StakeForm from './StakeForm'
import StakingDashboard from './StakingDashboard'

export default function App() {
  return (
    <div style={{ backgroundColor: '#000', minHeight: '100vh', padding: '2rem', color: '#fff' }}>
      <NetworkBanner />
      <h1 style={{ fontSize: '2rem' }}>🚀 HFV Staking DApp</h1>
      <ConnectWalletButton />
      <WalletStatus />
      <RewardCalculator />
      <StakeForm />
      <StakingDashboard />
    </div>
  )
}