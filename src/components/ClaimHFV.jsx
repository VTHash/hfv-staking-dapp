import React, { useEffect, useState } from 'react';
import { BrowserProvider, Contract, formatUnits } from 'ethers';
import stakingAbi from '../abi/HFVStaking.json';
console.log("Staking address env:", import.meta.env.VITE_HFV_STAKING_ADDRESS);
const stakingAddress = import.meta.env.VITE_HFV_STAKING_ADDRESS;

export default function ClaimHFV() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState('');
  const [stakes, setStakes] = useState([]);
  const [claimingIndex, setClaimingIndex] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        console.warn('MetaMask is not installed.');
        return;
      }

      const browserProvider = new BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const addr = await signer.getAddress();

      setProvider(browserProvider);
      setSigner(signer);
      setAddress(addr);
    };
    init();
  }, []);

  useEffect(() => {
    const fetchStakes = async () => {
      if (!stakingAddress) {
        console.error('❌ VITE_HFV_STAKING_ADDRESS is not defined in .env');
        return;
      }
      if (!signer || !address) return;

      try {
        const contract = new Contract(stakingAddress, stakingAbi, signer);
        const count = await contract.getStakeCount(address);
        const now = Math.floor(Date.now() / 1000);
        const result = [];

        for (let i = 0; i < count; i++) {
          const s = await contract.stakes(address, i);
          const unlockTime = Number(s.startTimestamp) + Number(s.duration);
          const isClaimable = !s.claimed && now >= unlockTime;

          result.push({
            index: i,
            amount: formatUnits(s.amount, 18),
            unlockTime,
            claimed: s.claimed,
            isClaimable,
          });
        }

        setStakes(result);
      } catch (err) {
        console.error('❌ Error loading claimable stakes:', err);
      }
    };

    fetchStakes();
  }, [signer, address]);

  const handleClaim = async (index) => {
    if (!signer || !stakingAddress) return;

    try {
      setClaimingIndex(index);
      const contract = new Contract(stakingAddress, stakingAbi, signer);
      const tx = await contract.claim(index);
      await tx.wait();
      alert(`✅ Claim successful for stake #${index}`);
      setClaimingIndex(null);
    } catch (err) {
      console.error('❌ Claim failed:', err);
      alert('Claim failed. Check the console.');
      setClaimingIndex(null);
    }
  };

  return (
    <div className="claim-hfv">
      <h2>Claim HFV Rewards</h2>

      {!stakingAddress ? (
        <p style={{ color: 'red' }}>
          ⚠️ Environment variable <strong>VITE_HFV_STAKING_ADDRESS</strong> is missing.
        </p>
      ) : stakes.length === 0 ? (
        <p>No stakes found.</p>
      ) : (
        <ul>
          {stakes.map((s) => (
            <li key={s.index}>
              <strong>Amount:</strong> {s.amount} HFV |
              <strong> Unlocks:</strong>{' '}
              {new Date(s.unlockTime * 1000).toLocaleDateString()} |
              <strong> Claimed:</strong> {s.claimed ? 'Yes' : 'No'}{' '}
              {s.isClaimable && !s.claimed && (
                <button
                  onClick={() => handleClaim(s.index)}
                  disabled={claimingIndex === s.index}
                >
                  {claimingIndex === s.index ? 'Claiming...' : 'Claim'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}