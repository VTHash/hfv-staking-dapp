import React, { useState } from "react";
import { ethers } from "ethers";
import stakingAbi from "../contracts/HFVStaking.json";

const stakingAddress = import.meta.env.VITE_HFV_STAKING;

export default function StakeForm() {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const stakeTokens = async () => {
    try {
      if (!window.ethereum) throw new Error("Please install MetaMask");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const staking = new ethers.Contract(stakingAddress, stakingAbi, signer);
      const parsedAmount = ethers.parseUnits(amount, 18);

      const tx = await staking.stake(parsedAmount);
      await tx.wait();
      setStatus("✅ Staked successfully");
    } catch (err) {
      setStatus("❌ Stake failed: " + err.message);
    }
  };

  return (
    <div className="bg-green-950 p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-2">Stake HFV</h2>
      <input
        type="number"
        className="w-full p-2 rounded text-black"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount of HFV"
      />
      <button onClick={stakeTokens} className="mt-2 bg-green-600 px-4 py-2 rounded">
        Stake
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
