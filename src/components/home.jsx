import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-lime-400">
      <img src="/logo.png" alt="HFV Logo" className="w-32 h-32 mb-4" />
      <h1 className="text-3xl font-bold mb-6">Welcome to HFV Staking</h1>
      <button
        onClick={() => navigate('/staking')}
        className="px-6 py-3 bg-lime-400 text-black rounded-full text-lg shadow-lg hover:scale-105 transition"
      >
        Launch DApp
      </button>
    </div>
  );
}