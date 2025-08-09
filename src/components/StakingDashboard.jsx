import React, { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import HFVStaking from '../abi/HFVStaking.json';

const stakingAbi = HFVStaking.abi;
const stakingAddress = import.meta.env.VITE_HFV_STAKING_ADDRESS;

// Map on-chain durations (seconds) to friendly labels
const PERIOD_LABELS = {
  1814400: '21 Days',
  7776000: '3 Months',
  15552000: '6 Months',
  31104000: '12 Months', // 12 * 30 days
  31536000: '12 Months', // (safety) 365 days, if ever used
};

const fmtPeriod = (sec) => PERIOD_LABELS[sec] || `${Math.round(Number(sec) / 86400)} Days`;

// HFV is 0 decimals → display raw integer
const fmtAmount = (v) => (typeof v === 'bigint' ? v.toString() : String(v));

export default function StakingDashboard() {
  const [stakes, setStakes] = useState([]);
  const [summary, setSummary] = useState([]); // [{label, amount}]
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('');

  const loadStakes = useCallback(async () => {
    try {
      setStatus(''); // clear
      if (!window.ethereum || !stakingAddress) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const user = await signer.getAddress();
      setAddress(user);

      const contract = new ethers.Contract(stakingAddress, stakingAbi, provider);

      const count = Number(await contract.getStakeCount(user));
      const rows = [];
      const sums = {}; // durationSec -> bigint

      for (let i = 0; i < count; i++) {
        const s = await contract.stakes(user, i);
        const amount = BigInt(s.amount); // 0 decimals
        const startSec = Number(s.startTimestamp);
        const durationSec = Number(s.duration);
        const unlockMs = (startSec + durationSec) * 1000;

        rows.push({
          index: i,
          amount,
          amountFmt: fmtAmount(amount),
          start: new Date(startSec * 1000).toLocaleDateString(),
          durationSec,
          periodLabel: fmtPeriod(durationSec),
          claimed: Boolean(s.claimed),
          unlocked: Date.now() >= unlockMs,
        });

        // build summary (only unclaimed stakes usually, but sum all so it matches "staked")
        sums[durationSec] = (sums[durationSec] || 0n) + amount;
      }

      // make a sorted summary (21d, 3m, 6m, 12m)
      const order = [1814400, 7776000, 15552000, 31104000, 31536000];
      const sumRows = order
        .filter((k) => sums[k] && sums[k] > 0n)
        .map((k) => ({ label: fmtPeriod(k), amountFmt: fmtAmount(sums[k]) }));

      setStakes(rows);
      setSummary(sumRows);
    } catch (err) {
      console.error('Fetch Stakes Error:', err);
      setStatus(`❌ Failed to load stakes: ${err?.reason || err?.message || 'Unknown error'}`);
    }
  }, []);

  useEffect(() => {
    loadStakes();

    // refresh when account/network changes
    if (window.ethereum) {
      const onAcct = () => loadStakes();
      const onChain = () => loadStakes();
      window.ethereum.on?.('accountsChanged', onAcct);
      window.ethereum.on?.('chainChanged', onChain);
      return () => {
        window.ethereum.removeListener?.('accountsChanged', onAcct);
        window.ethereum.removeListener?.('chainChanged', onChain);
      };
    }
  }, [loadStakes]);

  const handleClaim = async (index) => {
    try {
      setStatus(`⏳ Claiming stake #${index}...`);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(stakingAddress, stakingAbi, signer);
      const tx = await contract.claim(index);
      await tx.wait();
      setStatus(`✅ Stake #${index} claimed!`);
      loadStakes(); // refresh
    } catch (err) {
      console.error('Claim Error:', err);
      setStatus(`❌ Claim failed: ${err?.reason || err?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="staking-dashboard">
      <h3 className="section-title">Your Active Stakes</h3>
      {address && <p className="muted">Connected: {address.slice(0, 6)}…{address.slice(-4)}</p>}

      {/* Summary by period */}
      <div className="glow-subframe">
        <strong>Periods Summary</strong>
        {summary.length === 0 ? (
          <p>No stakes found.</p>
        ) : (
          <ul className="simple-list">
            {summary.map((row, i) => (
              <li key={i}>{row.label} — {row.amountFmt} HFV</li>
            ))}
          </ul>
        )}
      </div>

      {/* Individual stakes */}
      {stakes.length > 0 && (
        <ul>
          {stakes.map((s) => (
            <li key={s.index} className="glow-subframe">
              <div><strong>Period:</strong> {s.periodLabel} — {s.amountFmt} HFV</div>
              <div><strong>Start:</strong> {s.start}</div>
              <div><strong>Claimed:</strong> {s.claimed ? 'Yes' : 'No'}</div>
              {!s.claimed && s.unlocked && (
                <button onClick={() => handleClaim(s.index)} className="glow-button small">
                  Claim
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="row-gap">
        <button className="glow-button outline" onClick={loadStakes}>Refresh</button>
      </div>

      <p className="status-text">{status}</p>
    </div>
  );
}