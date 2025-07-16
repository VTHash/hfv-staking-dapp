import React, { useState } from "react";
import { ethers } from "ethers";
import stakingAbi from "../contracts/HFVStaking.json";
const stakingAbi = stakingAbiJson.abi;

const stakingAddress = import.meta.env.VITE_HFV_STAKING;

export default function StakeForm() {
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState("D21");
  const [status, setStatus] = useState("");

  const stakeTokens = async () => {
    try {
      if (!window.ethereum) throw new Error("Please install MetaMask");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const staking = new ethers.Contract(stakingAddress, stakingAbi, signer);

      const parsedAmount = ethers.parseUnits(amount, 18);
      const durationEnum = {
        D21: 0,
        D90: 1,
        D180: 2,
        D365: 3,
      }[duration];

      const tx = await staking.stake(parsedAmount, durationEnum);
      await tx.wait();
      setStatus("✅ Staked successfully");
    } catch (err) {
      setStatus("❌ Stake failed: " + err.message);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Stake HFV Tokens</h2>
      <div className="mb-4">
        <label className="block mb-1">Amount to Stake</label>
        <input
          type="number"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 1000"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Select Lock Duration</label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white"
        >
          <option value="D21">21 Days</option>
          <option value="D90">3 Months</option>
          <option value="D180">6 Months</option>
          <option value="D365">12 Months</option>
        </select>
      </div>
      <button
        onClick={stakeTokens}
        className="w-full py-2 bg-green-600 hover:bg-green-500 rounded text-black font-semibold"
      >
        Stake Now
      </button>
      {status && <p className="mt-4 text-center">{status}</p>}
    </div>
  );
}

