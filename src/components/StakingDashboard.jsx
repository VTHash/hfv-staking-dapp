import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import stakingAbi from './abi/Staking.json';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(import.meta.env.VITE_HFV_STAKING_ADDRESS, stakingAbi, signer);

export default function StakingDashboard() {
  const [stakeCount, setStakeCount] = useState(0);
  const [stakes, setStakes] = useState([]);

  useEffect(() => {
    const loadStakes = async () => {
      const address = await signer.getAddress();
      const count = await contract.getStakeCount(address);
      setStakeCount(Number(count));

      const stakeData = [];
      for (let i = 0; i < count; i++) {
        const s = await contract.stakes(address, i);
        stakeData.push(s);
      }
      setStakes(stakeData);
    };

    loadStakes();
  }, []);

  return (
    <div className="glow-frame" style={{ marginTop: '2rem' }}>
      <h2 style={{ color: '#0ff' }}>📊 Your Active Stakes</h2>
      {stakeCount === 0 ? (
        <p style={{ color: '#ccc' }}>You have no active stakes.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', color: '#0f0' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #0ff', padding: '0.5rem' }}>#</th>
              <th style={{ borderBottom: '1px solid #0ff', padding: '0.5rem' }}>Amount</th>
              <th style={{ borderBottom: '1px solid #0ff', padding: '0.5rem' }}>Duration</th>
              <th style={{ borderBottom: '1px solid #0ff', padding: '0.5rem' }}>Start</th>
              <th style={{ borderBottom: '1px solid #0ff', padding: '0.5rem' }}>Claimed</th>
            </tr>
          </thead>
          <tbody>
            {stakes.map((s, i) => (
              <tr key={i}>
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>{i}</td>
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>{ethers.utils.formatEther(s.amount)} HFV</td>
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>{s.duration / 60 / 60 / 24} days</td>
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                  {new Date(Number(s.startTimestamp) * 1000).toLocaleDateString()}
                </td>
                <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                  {s.claimed ? '✅' : '❌'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}