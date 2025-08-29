import React, { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import EthereumProvider from '@walletconnect/ethereum-provider';
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
const WC_PROJECT_ID = import.meta.env.VITE_PROJECT_ID;

// Human labels for the supported durations (seconds)
const PERIOD_LABELS = {
  1814400: '21 Days',
  7776000: '3 Months',
  15552000: '6 Months',
  31104000: '12 Months',
  31536000: '12 Months', // just in case some deployments used 365d
};
const fmtPeriod = (sec) => PERIOD_LABELS[sec] || `${Math.round(Number(sec) / 86400)} Days`;

const getInjected = () => (typeof window !== 'undefined' ? window.ethereum : null);
const normalizeAddress = (a) => (a && a.includes(':') ? a.split(':').pop() : a) || '';

async function getWCProvider() {
  if (!WC_PROJECT_ID) throw new Error('Missing VITE_PROJECT_ID for WalletConnect');
  return EthereumProvider.init({
    projectId: WC_PROJECT_ID,
    showQrModal: true,
    chains: [1],
    methods: [
      'eth_sendTransaction',
      'eth_signTransaction',
      'eth_sign',
      'personal_sign',
      'eth_signTypedData',
      'eth_requestAccounts',
      'wallet_switchEthereumChain',
    ],
    events: ['chainChanged', 'accountsChanged', 'disconnect'],
  });
}

export default function StakingDashboard() {
  const [address, setAddress] = useState('');
  const [provider, setProvider] = useState(null); // EIP-1193 provider (injected or WC)
  const [stakes, setStakes] = useState([]);
  const [summary, setSummary] = useState([]);
  const [status, setStatus] = useState('');
  const [wrongNetwork, setWrongNetwork] = useState(false);

  const getEthersProvider = useCallback(() => {
    if (!provider) return null;
    return new ethers.BrowserProvider(provider);
  }, [provider]);

  // Always use signer.getAddress() (works for both providers)
  const getSignerAddress = useCallback(async (pOverride = null) => {
    const p = pOverride || provider;
    if (!p) return '';
    const ep = new ethers.BrowserProvider(p);
    const signer = await ep.getSigner();
    const addr = await signer.getAddress();
    return ethers.getAddress(normalizeAddress(addr));
  }, [provider]);

  // ---- Connect (injected first, then WalletConnect), then load stakes
  const connectOrSwitch = async () => {
    try {
      setStatus('🔄 Connecting wallet…');

      const injected = getInjected();
      if (injected) {
        await injected.request({ method: 'eth_requestAccounts' });
        setProvider(injected);
        const addr = await getSignerAddress(injected);
        setAddress(addr);
        setStatus('✅ Connected');
        await loadStakes(injected, addr);
        return;
      }

      const wc = await getWCProvider();
      await wc.connect(); // QR / deep link
      setProvider(wc);
      const addr = await getSignerAddress(wc);
      setAddress(addr);
      setStatus('✅ Connected (WalletConnect)');
      await loadStakes(wc, addr);
    } catch (e) {
      setStatus(`❌ ${e?.message || 'Wallet connection cancelled'}`);
    }
  };

  // ---- Switch to Mainnet
  const switchToMainnet = async () => {
    try {
      if (!provider) throw new Error('No wallet provider');
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });
      setWrongNetwork(false);
      setStatus('✅ Switched to Ethereum Mainnet');
      await loadStakes();
    } catch (e) {
      setStatus(`❌ ${e?.message || 'Network switch failed'}`);
    }
  };

  // ---- Load stakes (keeps your styles/structure)
  const loadStakes = useCallback(
    async (pArg = null, aArg = '') => {
      try {
        setStatus((s) => (s.startsWith('✅') ? s : ''));
        setWrongNetwork(false);

        if (!stakingAddress) throw new Error('Missing staking address');

        const p = pArg || provider;
        if (!p) {
          setStatus('⚠ Wallet not connected');
          setStakes([]);
          setSummary([]);
          return;
        }

        const addr = aArg || (await getSignerAddress(p));
        if (!addr) {
          setStatus('⚠ Connect wallet to view stakes');
          setStakes([]);
          setSummary([]);
          return;
        }
        setAddress(addr);

        const ep = new ethers.BrowserProvider(p);
        const net = await ep.getNetwork();
        if (net.chainId !== 1n) {
          setWrongNetwork(true);
          setStatus('⚠ Wrong Network — please switch to Ethereum Mainnet');
          setStakes([]);
          setSummary([]);
          return;
        }

        const contract = new ethers.Contract(stakingAddress, stakingAbi, ep);

        // getStakeCount(address) -> uint256
        const rawCount = await contract.getStakeCount(addr);
        const count = Number(rawCount);

        const rows = [];
        const sums = {}; // durationSec -> BigInt total

        for (let i = 0; i < count; i++) {
          const s = await contract.stakes(addr, i);
          // ethers v6: numbers are bigint already
          const amount = s.amount; // DO NOT wrap with BigInt()
          const startSec = Number(s.startTimestamp);
          const durationSec = Number(s.duration);
          const claimed = Boolean(s.claimed);

          const unlockMs = (startSec + durationSec) * 1000;

          rows.push({
            index: i,
            amount, // bigint
            amountFmt: amount.toString(),
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
        if (rows.length === 0) setStatus('ℹ No stakes found');
      } catch (err) {
        console.error('Load stakes error:', err);
        setStatus(`❌ ${err?.reason || err?.message || 'Failed to load stakes'}`);
        setStakes([]);
        setSummary([]);
      }
    },
    [provider, getSignerAddress]
  );

  // ---- Silent auto-load for injected wallets already authorized
  useEffect(() => {
    (async () => {
      try {
        const injected = getInjected();
        if (!injected) return;
        const acc = await injected.request({ method: 'eth_accounts' });
        if (acc && acc.length) {
          setProvider(injected);
          const addr = await getSignerAddress(injected);
          setAddress(addr);
          await loadStakes(injected, addr);
        }
        injected.on?.('accountsChanged', async () => {
          const a = await getSignerAddress(injected).catch(() => '');
          setAddress(a || '');
          if (a) loadStakes(injected, a);
          else {
            setStakes([]);
            setSummary([]);
            setStatus('ℹ Wallet disconnected');
          }
        });
        injected.on?.('chainChanged', () => loadStakes(injected));
      } catch {
        /* no-op */
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Claim (uses signer from the active provider)
  const handleClaim = async (index) => {
    try {
      if (!provider) throw new Error('No wallet provider');
      setStatus(`⏳ Claiming stake #${index}…`);
      const ep = getEthersProvider();
      const signer = await ep.getSigner();
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

  return (
    <div className="staking-dashboard">
      <h3 className="section-title">Your Active Stakes</h3>

      {/* status output (keeps your styles) */}
      {status && <p className="tiny-muted" style={{ marginBottom: 8 }}>{status}</p>}

      <p className="tiny-muted">Stake count (debug): {stakes.length}</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span className="tiny-muted">
          {address ? <>Connected: {address.slice(0,6)}…{address.slice(-4)}</> : 'Wallet not connected'}
        </span>
        <button style={styles.btn} onClick={connectOrSwitch}>
          {address ? 'Switch Wallet' : 'Connect Wallet'}
        </button>
        <button style={{ ...styles.btn, marginLeft: 6 }} onClick={() => loadStakes()}>
          Refresh
        </button>
      </div>

      {wrongNetwork && (
        <div style={{ ...styles.card, marginBottom: 12 }}>
          <p>⚠ Wrong Network — please switch to Ethereum Mainnet.</p>
          <button style={{ ...styles.btn, marginTop: 6 }} onClick={switchToMainnet}>
            Switch to Ethereum Mainnet
          </button>
        </div>
      )}

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
