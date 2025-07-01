// File: src/App.jsx

import React from "react";
import ConnectWalletButton from "./components/ConnectWalletButton";
import StakeForm from "./components/StakeForm";
import RewardCalculator from "./components/RewardCalculator";
import ClaimButton from "./components/ClaimButton";
import AnalyticsDashboard from "./components/AnalyticsDashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-green-400 p-6 flex flex-col items-center">
      {/* Logo */}
      <img
        src="/hfv-logo.png"
        alt="HFV Logo"
        className="w-32 h-32 mb-4 rounded-full shadow-lg"
        style={{
          filter: "drop-shadow(0 0 10px limegreen)",
        }}
      />

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        HFV Staking DApp
      </h1>

      {/* DApp Components */}
      <div className="grid gap-6 w-full max-w-2xl">
        <ConnectWalletButton />
        <StakeForm />
        <RewardCalculator />
        <ClaimButton />
        <AnalyticsDashboard />
      </div>
    </div>
  );
}