import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import stakingAbi from '../abi/HFVStaking.json';

const stakingAddress = import.meta.env.VITE_HFV_STAKING_ADDRESS;

const Claim = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [pendingRewards, setPendingRewards] = useState([]);
  const [stakeCount, setStakeCount] = useState(0);
  const [claimingIndex, setClaimingIndex] = useState(null);

  useEffect(() => {
    const init = async () => {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();
      const contract = new ethers.Contract(stakingAddress, stakingAbi, signer);

      const count = await contract.getStakeCount(address);
      setStakeCount(count.toNumber());

      const rewards = [];
      for (let i = 0; i < count; i++) {
        const reward = await contract.getPendingReward(address, i);
        const stake = await contract.stakes(address, i);
        if (!stake.claimed && reward.gt(0)) {
          rewards.push({ reward: ethers.utils.formatUnits(reward, 18), index: i });
        }
      }

      setProvider(web3Provider);
      setSigner(signer);
      setContract(contract);
      setPendingRewards(rewards);
    };

    init();
  }, []);

  const handleClaim = async (index) => {
    try {
      setClaimingIndex(index);
      const tx = await contract.claim(index);
      await tx.wait();
      alert('Claim successful!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Claim failed!');
    } finally {
      setClaimingIndex(null);
    }
  };

  return (
    <div className="glow-frame">
      <h2>🔥 Claim HFV Rewards</h2>

      {stakeCount === 0 ? (
        <p>⚠️ No stakes found for this wallet.</p>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          {pendingRewards.map(({ reward, index }) => (
            <div key={index} className="glow-subframe">
              <strong>Stake #{index}</strong> ⛏️ Pending: <strong>{reward}</strong> HFV
              <button
                className="claim-button"
                onClick={() => handleClaim(index)}
                disabled={claimingIndex === index}
              >
                {claimingIndex === index ? 'Claiming...' : 'Claim'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Claim;