import ConnectWalletButton from './components/ConnectWalletButton'
import StakeForm from './components/StakeForm'
import RewardCalculator from './components/RewardCalculator'
import ClaimButton from './components/ClaimButton'
import AnalyticsDashboard from './components/AnalyticsDashboard'

function App() {
  return (
    <div className="App">
      <h1>HFV Staking DApp</h1>
      <ConnectWalletButton />
      <StakeForm />
      <RewardCalculator />
      <ClaimButton />
      <AnalyticsDashboard />
    </div>
  )
}

export default App