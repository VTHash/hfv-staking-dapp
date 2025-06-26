import React, { useState } from "react";
import { ethers } from "ethers";
import stakingAbi from "../contracts/HFVStaking.json";

const stakingAddress = import.meta.env.VITE_HFV_STAKING;

export default function ClaimButton() {
  const [status, setStatus] = useState("");

  const claimReward = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not detected");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const staking = new ethers.Contract(stakingAddress, stakingAbi, signer);

      const tx = await staking.claim();
      await tx.wait();
      setStatus("✅ Claimed successfully!");
    } catch (err) {
      setStatus("❌ Claim failed: " + err.message);
    }
  };

  return (
    <div className="bg-green-950 p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-2">Claim Rewards</h2>
      <button onClick={claimReward} className="bg-green-600 px-4 py-2 rounded">
        Claim
      </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
