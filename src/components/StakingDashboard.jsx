import React, { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import HFVStaking from '../abi/HFVStaking.json';
const styles = {
  card: {
    padding: 18,
    borderRadius: 14,
    background: 'linear-gradient(145deg, rgba(0,255,153,0.06), rgba(0,255,153,0.16))',
    border: '1px solid #00ff99',
    boxShadow: '0 0 8px rgba(0,255,153,0.45)',
  },
  listCard: {
    marginBottom: 10,
    color: '#eafff8',
    border: '1px solid #00ff99',
    background: 'linear-gradient(145deg, rgba(0,255,153,0.05), rgba(0,255,153,0.12))',
    boxShadow: '0 0 12px rgba(0,255,153,0.45)',
    borderRadius: 14,
    padding: 16,
  },
  btn: {
    background: 'linear-gradient(145deg, #00ff95, #00ffaa)',
    color: '#000',
    fontWeight: 700,
    border: 'none',
    borderRadius: 12,
    padding: '12px 16px',
    minHeight: 44,
    cursor: 'pointer',
    boxShadow: '0 0 12px #00ff95',
    transition: 'transform .2s ease, box-shadow .2s ease',
  },
  row: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 },
};

const stakingAbi = HFVStaking.abi;
const stakingAddress = import.meta.env.VITE_HFV_STAKING_ADDRESS;

// Human labels for the supported durations (seconds)
const PERIOD_LABELS = {
  1814400: '21 Days',
  7776000: '3 Months',
  15552000: '6 Months',
  31104000: '12 Months',
  31536000: '12 Months', // just in case some deployments used 365d
};

const fmtPeriod = (sec) => PERIOD_LABELS[sec] || `${Math.round(Number(sec) / 86400)} Days`;

export default function StakingDashboard() {
  const [address, setAddress] = useState('');
  const [stakes, setStakes] = useState([]);
  const [summary, setSummary] = useState([]);
  const [status, setStatus] = useState('');

  // Ask MetaMask only when needed; otherwise read silently
  const ensureConnected = useCallback(async (forcePrompt = false) => {
    if (!window.ethereum) throw new Error('Wallet not available');

    // Try silent first
    const silent = await window.ethereum.request({ method: 'eth_accounts' });
    if (!forcePrompt && silent && silent.length > 0) return silent[0];

    // Prompt user
    const req = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return req[0];
  }, []);

  const loadStakes = useCallback(async () => {
    try {
      setStatus('');
      if (!stakingAddress) throw new Error('Missing staking address');

      const addr = await ensureConnected(false);
      if (!addr) {
        setAddress('');
        setStakes([]);
        setSummary([]);
        return;
      }
      setAddress(addr);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(stakingAddress, stakingAbi, provider);

      // getStakeCount(address) -> uint256
      const rawCount = await contract.getStakeCount(addr);
      const count = Number(rawCount);

      const rows = [];
      const sums = {}; // durationSec -> BigInt total

      for (let i = 0; i < count; i++) {
        const s = await contract.stakes(addr, i);
        // Contract fields (ethers v6): numbers are BigInt-like, booleans are boolean
        const amount = BigInt(s.amount);
        const startSec = Number(s.startTimestamp);
        const durationSec = Number(s.duration);
        const claimed = Boolean(s.claimed);

        const unlockMs = (startSec + durationSec) * 1000;

        rows.push({
          index: i,
          amount, // keep BigInt in memory
          amountFmt: amount.toString(), // render-safe
          startFmt: new Date(startSec * 1000).toLocaleString(),
          durationSec,
          periodLabel: fmtPeriod(durationSec),
          claimed,
          unlocked: Date.now() >= unlockMs,
        });

        const key = durationSec;
        sums[key] = (sums[key] || 0n) + amount;
      }

      // Period summary (ordered)
      const order = [1814400, 7776000, 15552000, 31104000, 31536000];
      const sumRows = order
        .filter((k) => (sums[k] || 0n) > 0n)
        .map((k) => ({ label: fmtPeriod(k), amountFmt: (sums[k] || 0n).toString() }));

      setStakes(rows);
      setSummary(sumRows);
    } catch (err) {
      console.error('Load stakes error:', err);
      setStatus(`❌ ${err?.reason || err?.message || 'Failed to load stakes'}`);
      setStakes([]);
      setSummary([]);
    }
  }, [ensureConnected]);

  const connectOrSwitch = async () => {
    try {
      setStatus('🔄 Connecting wallet…');
      const addr = await ensureConnected(true); // force prompt to pick/switch
      setAddress(addr);
      await loadStakes();
      setStatus('');
    } catch (e) {
      setStatus(`❌ ${e?.message || 'Wallet connection cancelled'}`);
    }
  };

  const handleClaim = async (index) => {
    try {
      setStatus(`⏳ Claiming stake #${index}…`);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(stakingAddress, stakingAbi, signer);

      const tx = await contract.claim(index);
      await tx.wait();

      setStatus(`✅ Stake #${index} claimed!`);
      loadStakes();
    } catch (err) {
      console.error('Claim error:', err);
      setStatus(`❌ Claim failed: ${err?.reason || err?.message || 'Unknown error'}`);
    }
  };

  // Initial load + react to account/chain changes
  useEffect(() => {
    loadStakes();

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

  return (
    <div className="staking-dashboard">
      <h3 className="section-title">Your Active Stakes</h3>
      <p className="tiny-muted">Stake count (debug): {stakes.length}</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span className="tiny-muted">
          {address ? <>Connected: {address.slice(0,6)}…{address.slice(-4)}</> : 'Wallet not connected'}
        </span>
        <button style={styles.btn} onClick={connectOrSwitch}>
          {address ? 'Switch Wallet' : 'Connect Wallet'}
        </button>
        <button style={{ ...styles.btn, marginLeft: 6 }} onClick={loadStakes}>Refresh</button>
      </div>

      {/* Period totals */}
     <div style={{ ...styles.card, marginBottom: 12 }}>
  <strong>Periods Summary</strong>
  {summary.length === 0 ? (
    <p>No stakes found.</p>
  ) : (
    <ul className="simple-list" style={{ marginTop: 6 }}>
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
      <li key={s.index} style={styles.listCard}>
        <div><strong>#</strong> {s.index}</div>
        <div><strong>Period:</strong> {s.periodLabel}</div>
        <div><strong>Amount:</strong> {s.amountFmt} HFV</div>
        <div><strong>Start:</strong> {s.startFmt}</div>
        <div><strong>Status:</strong> {s.claimed ? 'Claimed' : s.unlocked ? 'Unlocked' : 'Locked'}</div>
        {!s.claimed && s.unlocked && (
          <button style={styles.btn} onClick={() => handleClaim(s.index)}>
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