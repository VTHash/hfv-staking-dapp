import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import stakingAbi from '../abi/HFVStaking.json';

const stakingAddress = import.meta.env.VITE_HFV_STAKING_ADDRESS;

export default function StakingDashboard() {
  const [stakes, setStakes] = useState([]);
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('');

  const fetchStakes = async () => {
    try {
      if (!window.ethereum || !stakingAddress) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);

      const contract = new ethers.Contract(stakingAddress, stakingAbi, signer);
      const stakeCount = await contract.getStakeCount(userAddress);
      const result = [];

      for (let i = 0; i < stakeCount; i++) {
        const stake = await contract.stakes(userAddress, i);
        const unlocked = Date.now() >= Number(stake.startTimestamp) * 1000 + Number(stake.duration) * 1000;

        result.push({
          index: i,
          amount: ethers.formatUnits(stake.amount, 0), // HFV has 0 decimals
          start: new Date(Number(stake.startTimestamp) * 1000).toLocaleDateString(),
          duration: (Number(stake.duration) / 86400).toFixed(0),
          claimed: stake.claimed,
          unlocked,
        });
      }

      setStakes(result);
    } catch (err) {
      console.error('Error loading stakes:', err);
      setStatus(`Error: ${err.message}`);
    }
  };

  const handleClaim = async (index) => {
    try {
      setStatus(`Claiming stake ${index}...`);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(stakingAddress, stakingAbi, signer);
      const tx = await contract.claim(index);
      await tx.wait();
      setStatus(`✅ Stake #${index} claimed.`);
      fetchStakes(); // Refresh after claim
    } catch (err) {
      console.error('Claim error:', err);
      setStatus(`❌ Claim failed: ${err.reason || err.message}`);
    }
  };

  useEffect(() => {
    fetchStakes();
  }, []);

  return (
    <div className="staking-dashboard">
      <h3 className="section-title">Your Active Stakes</h3>
      {status && <p className="status-text">{status}</p>}
      {stakes.length === 0 ? (
        <p>No stakes found.</p>
      ) : (
        <ul>
          {stakes.map((s, i) => (
            <li key={i} className="glow-subframe">
              <strong>Amount:</strong> {s.amount} HFV<br />
              <strong>Start:</strong> {s.start}<br />
              <strong>Duration:</strong> {s.duration} days<br />
              <strong>Claimed:</strong> {s.claimed ? '✅' : '❌'}<br />
              {s.unlocked && !s.claimed && (
                <button onClick={() => handleClaim(s.index)} className="glow-button">
                  Claim
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}