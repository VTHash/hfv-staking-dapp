import React, { useState, useEffect } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import stakingAbi from '../abi/HFVStaking.json';

const stakingAddress = import.meta.env.VITE_HFV_STAKING_ADDRESS;

const DURATION_OPTIONS = [
  { label: '21 Days', value: 21 * 24 * 60 * 60, multiplier: 1 },
  { label: '3 Months', value: 3 * 30 * 24 * 60 * 60, multiplier: 3 },
  { label: '6 Months', value: 6 * 30 * 24 * 60 * 60, multiplier: 6 },
  { label: '12 Months', value: 12 * 30 * 24 * 60 * 60, multiplier: 12 },
];

export default function StakeForm() {
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState(DURATION_OPTIONS[0].value);
  const [multiplier, setMultiplier] = useState(DURATION_OPTIONS[0].multiplier);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [rewardPreview, setRewardPreview] = useState('');

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const browserProvider = new BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner();
        setProvider(browserProvider);
        setSigner(signer);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return setRewardPreview('');
    const reward = amt * 6.952 * multiplier;
    setRewardPreview(reward.toFixed(2));
  }, [amount, multiplier]);

  const handleStake = async () => {
    if (!provider || !signer || !stakingAddress) {
      console.error('Provider or signer not available');
      return;
    }

    try {
      const contract = new ethers.Contract(stakingAddress, stakingAbi, signer);
      const parsedAmount = ethers.parseUnits(amount, 18);
      const tx = await contract.stake(parsedAmount, duration);
      await tx.wait();
      alert('HFV successfully staked!');
      setAmount('');
    } catch (err) {
      console.error('Staking failed:', err);
      alert('Error during staking. Check console.');
    }
  };

  return (
    <div className="stake-form">
      <h2>Stake HFV Tokens</h2>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select
        value={duration}
        onChange={(e) => {
          const selected = DURATION_OPTIONS.find(opt => opt.value === parseInt(e.target.value));
          setDuration(selected.value);
          setMultiplier(selected.multiplier);
        }}
      >
        {DURATION_OPTIONS.map((opt) => (
          <option key={opt.label} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button onClick={handleStake}>Stake</button>
      {rewardPreview && (
        <p className="reward-preview">
          Estimated Reward: <strong>{rewardPreview} HFV</strong>
        </p>
      )}
    </div>
  );
}