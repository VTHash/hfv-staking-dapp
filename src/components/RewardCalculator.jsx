import React, { useState } from 'react';

const DURATION_OPTIONS = [
  { label: '21 Days', multiplier: 1 },
  { label: '3 Months', multiplier: 3 },
  { label: '6 Months', multiplier: 6 },
  { label: '12 Months', multiplier: 12 },
];

export default function RewardCalculator() {
  const [amount, setAmount] = useState('');
  const [multiplier, setMultiplier] = useState(1);
  const [estimatedReward, setEstimatedReward] = useState('');

  const calculateReward = () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setEstimatedReward('');
      return;
    }

    const reward = parsedAmount * 6.952 * multiplier;
    setEstimatedReward(reward.toFixed(2));
  };

  return (
    <div className="reward-calculator">
      <h2>Staking Reward Calculator</h2>

      <div className="form-group">
        <label htmlFor="amount">HFV Amount to Stake:</label>
        <input
          type="number"
          id="amount"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="duration">Lock Duration:</label>
        <select
          id="duration"
          value={multiplier}
          onChange={(e) => setMultiplier(parseInt(e.target.value))}
        >
          {DURATION_OPTIONS.map((option) => (
            <option key={option.label} value={option.multiplier}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button onClick={calculateReward}>Calculate</button>

      {estimatedReward && (
        <div className="reward-result">
          <p>Estimated Reward: <strong>{estimatedReward} HFV</strong></p>
        </div>
      )}
    </div>
  );
}