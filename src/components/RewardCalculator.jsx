import React, { useState } from 'react'

const DURATION_OPTIONS = [
  { label: '21 Days', multiplier: 1 },
  { label: '3 Months', multiplier: 3 },
  { label: '6 Months', multiplier: 6 },
  { label: '12 Months', multiplier: 12 },
]

export default function RewardCalculator() {
  const [amount, setAmount] = useState('')
  const [selected, setSelected] = useState(DURATION_OPTIONS[1])
  const BASE_APY = 0.4
  const BOOST = 17.38

  const reward = amount
    ? (amount * BASE_APY * BOOST * selected.multiplier).toFixed(2)
    : '0.00'

  return (
    <div
      style={{
        backgroundColor: '#101010',
        padding: '2rem',
        borderRadius: '1rem',
        marginTop: '1rem',
        color: '#fff',
        maxWidth: '480px',
      }}
    >
      <h3>HFV Reward Calculator</h3>
      <input
        type="number"
        placeholder="Enter HFV amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: '100%', margin: '1rem 0', padding: '0.5rem' }}
      />
      <select
        value={selected.multiplier}
        onChange={(e) =>
          setSelected(DURATION_OPTIONS.find(d => d.multiplier == e.target.value))
        }
        style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
      >
        {DURATION_OPTIONS.map((d) => (
          <option key={d.multiplier} value={d.multiplier}>
            {d.label}
          </option>
        ))}
      </select>
      <div>
        🔮 Estimated Reward: <strong>{reward} HFV</strong>
      </div>
    </div>
  )
}