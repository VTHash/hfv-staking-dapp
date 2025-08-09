import React, { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import HFVStaking from '../abi/HFVStaking.json';

const stakingAbi = HFVStaking.abi;
const stakingAddress = import.meta.env.VITE_HFV_STAKING_ADDRESS;

const PERIOD_LABELS = {
  1814400: '21 Days',
  7776000: '3 Months',
  15552000: '6 Months',
  31104000: '12 Months',
  31536000: '12 Months',
};
const fmtPeriod = (sec) => PERIOD_LABELS[sec] || `${Math.round(Number(sec) / 86400)} Days`;
const fmtAmount = (v) => (typeof v === 'bigint' ? v.toString() : String(v));

export default function StakingDashboard() {
  const [stakes, setStakes] = useState([]);
  const [summary, setSummary] = useState([]);
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState('');

  const ensureConnected = useCallback(async (forcePrompt = false) => {
    if (!window.ethereum) throw new Error('Wallet not available');
    // Silent check first
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts && accounts.length > 0 && !forcePrompt) return accounts[0];

    // Not connected or user wants to switch: prompt
    try {
      const req = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return req[0];
    } catch (e) {
      // User rejected, or pending request; surface clean message
      throw new Error(e?.message || 'Wallet connection was cancelled.');
    }
  }, []);

  const loadStakes = useCallback(async () => {
    try {
      setStatus('');
      if (!window.ethereum || !stakingAddress) return;

      // connect if needed (silent if already connected)
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

      const count = Number(await contract.getStakeCount(addr));
      const rows = [];
      const sums = {};

      for (let i = 0; i < count; i++) {
        const s = await contract.stakes(addr, i);
        const amount = BigInt(s.amount);
        const startSec = Number(s.startTimestamp);
        const durationSec = Number(s.duration);
        const unlockMs = (startSec + durationSec) * 1000;

        rows.push({
          index: i,
          amount,
          amountFmt: fmtAmount(amount),
          startFmt: new Date(startSec * 1000).toLocaleString(),
          durationSec,
          periodLabel: fmtPeriod(durationSec),
          claimed: Boolean(s.claimed),
          unlocked: Date.now() >= unlockMs,
        });

        sums[durationSec] = (sums[durationSec] || 0n) + amount;
      }

      const order = [1814400, 7776000, 15552000, 31104000, 31536000];
      const sumRows = order
        .filter((k) => (sums[k] || 0n) > 0n)
        .map((k) => ({ label: fmtPeriod(k), amountFmt: fmtAmount(sums[k]) }));

      setStakes(rows);
      setSummary(sumRows);
    } catch (err) {
      console.error('Load stakes error:', err);
      setStatus(`❌ ${err?.reason || err?.message || 'Failed to load stakes'}`);
    }
  }, [ensureConnected]);

  const connectOrSwitch = async () => {
    try {
      setStatus('🔄 Connecting wallet…');
      const addr = await ensureConnected(true); // force prompt to choose/switch
      setAddress(addr);
      await loadStakes();
      setStatus('');
    } catch (e) {
      setStatus(`❌ ${e.message}`);
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
      console.error('Claim Error:', err);
      setStatus(`❌ Claim failed: ${err?.reason || err?.message || 'Unknown error'}`);
    }
  };

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

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span className="tiny-muted">
          {address ? <>Connected: {address.slice(0,6)}…{address.slice(-4)}</> : 'Wallet not connected'}
        </span>
        <button className="glow-button small" onClick={connectOrSwitch}>
          {address ? 'Switch Wallet' : 'Connect Wallet'}
        </button>
        <button className="glow-button small" onClick={loadStakes}>Refresh</button>
      </div>

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

      {stakes.length > 0 && (
        <ul>
          {stakes.map((s) => (
            <li key={s.index} className="glow-subframe">
              <div><strong>Period:</strong> {s.periodLabel} — {s.amountFmt} HFV</div>
              <div><strong>Start:</strong> {s.startFmt}</div>
              <div><strong>Status:</strong> {s.claimed ? 'Claimed' : s.unlocked ? 'Unlocked' : 'Locked'}</div>
              {!s.claimed && s.unlocked && (
                <button className="glow-button small" onClick={() => handleClaim(s.index)}>
                  Claim
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {status && <p className="status-text">{status}</p>}
    </div>
  );
}
