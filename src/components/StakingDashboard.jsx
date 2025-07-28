import React, { useEffect, useState } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import stakingAbi from '../abi/HFVStaking.json';

const stakingAddress = import.meta.env.VITE_HFV_STAKING_ADDRESS;

export default function StakingDashboard() {
  const [stakes, setStakes] = useState([]);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [userAddress, setUserAddress] = useState('');

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return;
      const browserProvider = new BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();
      setProvider(browserProvider);
      setSigner(signer);
      setUserAddress(address);
    };
    init();
  }, []);

  useEffect(() => {
    const loadStakes = async () => {
      if (!provider || !signer || !stakingAddress || !userAddress) return;

      try {
        const contract = new ethers.Contract(stakingAddress, stakingAbi, signer);
        const count = await contract.getStakeCount(userAddress);
        const results = [];

        for (let i = 0; i < count; i++) {
          const stake = await contract.stakes(userAddress, i);
          results.push({
            amount: ethers.formatUnits(stake.amount, 18),
            duration: stake.duration,
            start: stake.startTimestamp,
            claimed: stake.claimed,
          });
        }

        setStakes(results);
      } catch (err) {
        console.error('Error loading stakes:', err);
      }
    };

    loadStakes();
  }, [provider, signer, userAddress]);

  return (
    <div className="staking-dashboard">
      <h2>Your Active Stakes</h2>
      {stakes.length === 0 ? (
        <p>No active stakes.</p>
      ) : (
        <ul>
          {stakes.map((s, idx) => (
            <li key={idx}>
              <strong>Amount:</strong> {s.amount} HFV |{' '}
              <strong>Duration:</strong> {s.duration / (24 * 60 * 60)} days |{' '}
              <strong>Claimed:</strong> {s.claimed ? 'Yes' : 'No'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}