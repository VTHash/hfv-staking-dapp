import React, { useState } from 'react';
import { ethers } from 'ethers';
import stakingAbi from '../abi/Staking.json';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(import.meta.env.VITE_HFV_STAKING_ADDRESS, stakingAbi, signer);

const DURATION_OPTIONS = [
  { label: '21 Days', multiplier: 1 },
  { label: '3 Months', multiplier: 3 },
  { label: '6 Months', multiplier: 6 },
  { label: '12 Months', multiplier: 12 },
];

export default function RewardCalculator() {
  const [amount, setAmount] = useState('');
  const [selected, setSelected] = useState(DURATION_OPTIONS[1]);

  const BASE_APY = 0.4;
  const BOOST = 17.38;

  const reward = amount
    ? (amount * BASE_APY * BOOST * selected.multiplier).toFixed(2)
    : '0.00';

  return (
    <div className="glow-frame" style={{ marginTop: '2rem' }}>
      <h2 style={{ color: '#0f0' }}>🎯 HFV Staking Reward Calculator</h2>
      <label>
        HFV Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            marginLeft: '1rem',
            padding: '0.5rem',
            borderRadius: '0.25rem',
            border: 'none',
            backgroundColor: '#111',
            color: '#0f0'
          }}
        />
      </label>
      <br /><br />
      <label>
        Select Lock Duration:
        <select
          value={selected.label}
          onChange={(e) =>
            setSelected(DURATION_OPTIONS.find(opt => opt.label === e.target.value))
          }
          style={{
            marginLeft: '1rem',
            padding: '0.5rem',
            borderRadius: '0.25rem',
            backgroundColor: '#111',
            color: '#0f0',
            border: 'none'
          }}
        >
          {DURATION_OPTIONS.map((opt) => (
            <option key={opt.label} value={opt.label}>{opt.label}</option>
          ))}
        </select>
      </label>
      <br /><br />
      <strong>Estimated Rewards:</strong>{' '}
      <span style={{ color: '#0ff', fontSize: '1.2rem' }}>{reward} HFV</span>
    </div>
  );
}
