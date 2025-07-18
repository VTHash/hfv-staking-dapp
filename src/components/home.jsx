import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LogoStyles.css';
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-lime-400 px-4 py-8">
      <img
        src="/logo.png"
        alt="HFV Logo"
        className="logo"
      />

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-4 leading-tight">
        Welcome to <span className="text-lime-300">HFV Staking</span>
      </h1>

      <p className="text-center text-gray-300 text-base sm:text-lg md:text-xl max-w-md sm:max-w-xl mb-8">
        Stake your HFV tokens and earn rewards. Choose your lock period and let your assets grow confidently.
      </p>

      <button
        onClick={() => navigate('/staking')}
        className="px-6 py-3 sm:px-8 sm:py-4 bg-lime-400 text-black rounded-full text-base sm:text-lg shadow-xl hover:scale-105 hover:shadow-lime-400 transition"
      >
        🚀 Launch DApp
      </button>
    </div>
  );
}