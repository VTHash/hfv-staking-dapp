import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import stakingAbi from '../abi/HFVStaking.json';

const stakingAddress = import.meta.env.VITE_HFV_STAKING_ADDRESS;

export default function StakingDashboard() {
  const [stakes, setStakes] = useState([]);
  const [address, setAddress] = useState('');

  useEffect(() => {
    const fetchStakes = async () => {
      if (!window.ethereum || !stakingAddress) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);

      const contract = new ethers.Contract(stakingAddress, stakingAbi, signer);
      const stakeCount = await contract.getStakeCount(userAddress);
      const result = [];

      for (let i = 0; i < stakeCount; i++) {
        const s = await contract.stakes(userAddress, i);
        result.push({
          amount: ethers.formatUnits(s.amount, 18),
          start: new Date(Number(s.startTimestamp) * 1000).toLocaleDateString(),
          duration: Number(s.duration),
          claimed: s.claimed,
        });
      }

      setStakes(result);
    };

    fetchStakes();
  }, []);

  return (
    <div className="staking-dashboard">
      <h3 className="section-title">Your Active Stakes</h3>
      {stakes.length === 0 ? (
        <p>No stakes found.</p>
      ) : (
        <ul>
          {stakes.map((s, i) => (
            <li key={i} className="glow-subframe">
              <strong>Amount:</strong> {s.amount} HFV<br />
              <strong>Start:</strong> {s.start}<br />
              <strong>Duration:</strong> {(s.duration / 86400).toFixed(0)} days<br />
              <strong>Claimed:</strong> {s.claimed ? 'Yes' : 'No'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
