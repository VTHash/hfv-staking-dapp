import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import stakingAbi from '../abi/HFVStaking.json';

const stakingAddress = import.meta.env.VITE_HFV_STAKING_ADDRESS;

export default function StakingDashboard() {
  const [stakes, setStakes] = useState([]);
  const [userAddress, setUserAddress] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchStakes = async () => {
      try {
        if (!window.ethereum || !stakingAddress) return;

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);

        const contract = new ethers.Contract(stakingAddress, stakingAbi.abi, signer);
        const stakeCount = Number(await contract.getStakeCount(address)); // ✅ BigInt → Number

        const results = [];
        for (let i = 0; i < stakeCount; i++) {
          const s = await contract.stakes(address, i);
          results.push({
            index: i,
            amount: s.amount.toString(), // ✅ 0-decimal token
            start: new Date(Number(s.startTimestamp) * 1000).toLocaleDateString(),
            duration: Number(s.duration),
            claimed: s.claimed,
            unlocked: Date.now() >= (Number(s.startTimestamp) + Number(s.duration)) * 1000,
          });
        }
        setStakes(results);
      } catch (err) {
        console.error('Fetch Stakes Error:', err);
        setStatus(`Error: ${err?.reason || err?.message || 'Failed to load stakes'}`);
      }
    };

    fetchStakes();
  }, []);

  const handleClaim = async (index) => {
    try {
      setStatus(`⏳ Claiming stake #${index}...`);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(stakingAddress, stakingAbi.abi, signer);
      const tx = await contract.claim(index);
      await tx.wait();
      setStatus(`✅ Stake #${index} claimed!`);

      // refresh
      const address = await signer.getAddress();
      const stakeCount = Number(await contract.getStakeCount(address));
      const refreshed = [];
      for (let i = 0; i < stakeCount; i++) {
        const s = await contract.stakes(address, i);
        refreshed.push({
          index: i,
          amount: s.amount.toString(),
          start: new Date(Number(s.startTimestamp) * 1000).toLocaleDateString(),
          duration: Number(s.duration),
          claimed: s.claimed,
          unlocked: Date.now() >= (Number(s.startTimestamp) + Number(s.duration)) * 1000,
        });
      }
      setStakes(refreshed);
    } catch (err) {
      console.error('Claim Error:', err);
      setStatus(`❌ Claim failed: ${err?.reason || err?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="staking-dashboard">
      <h3 className="section-title">Your Active Stakes</h3>

      {!userAddress ? (
        <ul>
          <li className="glow-subframe">Connect your wallet to view your stakes.</li>
        </ul>
      ) : stakes.length === 0 ? (
        <ul>
          <li className="glow-subframe">No active stakes found.</li>
        </ul>
      ) : (
        <ul>
          {stakes.map((s) => (
            <li key={s.index} className="glow-subframe">
              <strong>Amount:</strong> {s.amount} HFV<br />
              <strong>Start:</strong> {s.start}<br />
              <strong>Duration:</strong> {(s.duration / 86400).toFixed(0)} days<br />
              <strong>Claimed:</strong> {s.claimed ? 'Yes' : 'No'}<br />
              {!s.claimed && s.unlocked && (
                <button onClick={() => handleClaim(s.index)} className="glow-button small">
                  Claim
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="status-text">{status}</p>
    </div>
  );
}
