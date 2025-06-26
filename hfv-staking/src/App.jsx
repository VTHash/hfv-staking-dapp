import React from "react";
import ConnectWalletButton from "./components/ConnectWalletButton";
import StakeForm from "./components/StakeForm";
import RewardCalculator from "./components/RewardCalculator";
import ClaimButton from "./components/ClaimButton";
import AnalyticsDashboard from "./components/AnalyticsDashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      <h1 className="text-3xl font-bold mb-6">HFV Staking DApp</h1>
      <div className="grid gap-6">
        <StakeForm />
        <RewardCalculator />
        <ClaimButton />
        <AnalyticsDashboard />
      </div>
    </div>
  );
}

