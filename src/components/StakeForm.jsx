import { useState } from 'react';
import { ethers } from 'ethers';
import stakingAbi from '../abi/HFVStaking.json';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(
  import.meta.env.VITE_HFV_STAKING_ADDRESS,
  stakingAbi,
  signer
);

const StakeForm = () => {
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('21');

  const handleStake = async () => {
    try {
      const parsedAmount = ethers.utils.parseUnits(amount, 18);
      const durationInSeconds = parseInt(duration) * 24 * 60 * 60;

      const tx = await contract.stake(parsedAmount, durationInSeconds);
      await tx.wait();
      alert('Staked successfully!');
    } catch (err) {
      console.error('Stake error:', err);
      alert('Stake failed. Check console for details.');
    }
  };

  return (
    <div className="glow-frame" style={{ padding: '2rem', marginTop: '1rem' }}>
      <h2>🚀 Stake HFV</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>Amount to stake (HFV): </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.0"
          style={{
            padding: '0.5rem',
            backgroundColor: '#111',
            color: '#0f0',
            border: '1px solid #0f0',
            borderRadius: '0.25rem',
            width: '100%',
            marginTop: '0.5rem'
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Lock duration: </label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          style={{
            padding: '0.5rem',
            backgroundColor: '#111',
            color: '#0ff',
            border: '1px solid #0ff',
            borderRadius: '0.25rem',
            width: '100%',
            marginTop: '0.5rem'
          }}
        >
          <option value="21">21 Days</option>
          <option value="90">3 Months</option>
          <option value="180">6 Months</option>
          <option value="365">12 Months</option>
        </select>
      </div>

      <button
        onClick={handleStake}
        style={{
          padding: '0.75rem 1.5rem',
          background: '#0f0',
          color: '#000',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 0 10px #0f0, 0 0 20px #0ff',
          transition: 'transform 0.2s ease-in-out'
        }}
        onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
        onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
      >
        Stake
      </button>
    </div>
  );
};

export default StakeForm;
