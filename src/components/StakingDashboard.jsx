import React from 'react';
import StakeForm from './StakeForm';
import RewardCalculator from './RewardCalculator';
import WalletStatus from './WalletStatus';
import NetworkBanner from './NetworkBanner';

const StakingDashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans px-4 py-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="HFV Logo" className="w-32 h-auto mb-4 drop-shadow-lg animate-pulse" />
          <h1 className="text-3xl md:text-4xl font-bold text-[#a3ff59] drop-shadow-lg">
            HFV Staking Dashboard
          </h1>
        </div>
        <WalletStatus />
      </header>

      {/* Network Info */}
      <NetworkBanner />

      {/* Overview */}
      <section className="mt-6 bg-[#111] rounded-2xl p-6 shadow-md border border-[#6aff2d50]">
        <h2 className="text-2xl font-semibold mb-4 text-[#6aff2d]">Your Staking Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1a1a1a] p-4 rounded-xl shadow-inner">
            <p className="text-sm text-gray-400">Total Staked</p>
            <p className="text-xl font-bold text-[#a3ff59]">...</p>
          </div>
          <div className="bg-[#1a1a1a] p-4 rounded-xl shadow-inner">
            <p className="text-sm text-gray-400">Claimable Rewards</p>
            <p className="text-xl font-bold text-[#a3ff59]">...</p>
          </div>
          <div className="bg-[#1a1a1a] p-4 rounded-xl shadow-inner">
            <p className="text-sm text-gray-400">Your APY Tier</p>
            <p className="text-xl font-bold text-[#a3ff59]">...</p>
          </div>
        </div>
      </section>

      {/* Stake Actions */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-[#6aff2d]">Stake Your HFV</h2>
        <StakeForm />
      </section>

      {/* Reward Calculator */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-[#6aff2d]">Estimate Your Rewards</h2>
        <RewardCalculator />
      </section>
    </div>
  );
};

export default StakingDashboard;