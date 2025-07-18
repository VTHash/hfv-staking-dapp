import React from 'react';
import WalletStatus from './WalletStatus';
import StakeForm from './StakeForm';
import RewardCalculator from './RewardCalculator';
import NetworkBanner from './NetworkBanner';
import './LogoStyles.css';
const StakingDashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans px-4 py-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <img src="/logo.png" alt="HFV Logo" className="w-12 h-12 md:w-14 md:h-14" />
          <h1 className="text-2xl md:text-4xl font-bold text-[#a3ff59] drop-shadow-lg text-center md:text-left">
            HFV Staking Dashboard
          </h1>
        </div>
        <div className="w-full md:w-auto flex justify-center md:justify-end">
          <WalletStatus />
        </div>
      </header>

      {/* Network Info */}
      <NetworkBanner />

      {/* Overview */}
      <section className="mt-6 bg-[#111] rounded-2xl p-6 shadow-md border border-[#6aff2d50]">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#6aff2d] text-center md:text-left">
          Your Staking Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1a1a1a] p-4 rounded-xl shadow-inner text-center">
            <p className="text-sm text-gray-400">Total Staked</p>
            <p className="text-xl font-bold text-[#a3ff59]">...</p>
          </div>
          <div className="bg-[#1a1a1a] p-4 rounded-xl shadow-inner text-center">
            <p className="text-sm text-gray-400">Claimable Rewards</p>
            <p className="text-xl font-bold text-[#a3ff59]">...</p>
          </div>
          <div className="bg-[#1a1a1a] p-4 rounded-xl shadow-inner text-center">
            <p className="text-sm text-gray-400">Your APY Tier</p>
            <p className="text-xl font-bold text-[#a3ff59]">...</p>
          </div>
        </div>
      </section>

      {/* Stake Actions */}
      <section className="mt-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#6aff2d] text-center md:text-left">
          Stake Your HFV
        </h2>
        <StakeForm />
      </section>

      {/* Reward Calculator */}
      <section className="mt-10 mb-12">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-[#6aff2d] text-center md:text-left">
          Estimate Your Rewards
        </h2>
        <RewardCalculator />
      </section>
    </div>
  );
};

export default StakingDashboard;