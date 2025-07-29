import React, { useEffect, useState } from 'react'; 
import { ethers, BrowserProvider } from 'ethers'; 
import stakingAbi from '../abi/HFVStaking.json';

const stakingAddress = import.meta.env.VITE_HFV_STAKING_ADDRESS;

export default function ClaimHFV() { 
  const [provider, setProvider] = useState(null); 
  const [signer, setSigner] = useState(null); 
  const [address, setAddress] = useState(''); 
  const [stakes, setStakes] = useState([]); 
  const [claimingIndex, setClaimingIndex] = useState(null);

useEffect(() => { 
  const init = async () => { 
    if (!window.ethereum) return;

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
    if (!stakingAddress || !signer || !address) return;

try {
    const contract = new ethers.Contract(stakingAddress, stakingAbi, signer);
    const count = await contract.getStakeCount(address);
    const now = Math.floor(Date.now() / 1000);
    const result = [];

    for (let i = 0; i < count; i++) {
      const s = await contract.stakes(address, i);
      const unlockTime = Number(s.startTimestamp) + Number(s.duration);
      const isClaimable = !s.claimed && now >= unlockTime;

      result.push({
        index: i,
        amount: ethers.formatUnits(s.amount, 18),
        unlockTime,
        claimed: s.claimed,
        isClaimable,
      });
    }

    setStakes(result);
  } catch (err) {
    console.error('Error fetching stakes:', err);
  }
};

fetchStakes();

}, [signer, address]);

const handleClaim = async (index) => { 
  if (!signer || !stakingAddress) return;

try {
  setClaimingIndex(index);
  const contract = new ethers.Contract(stakingAddress, stakingAbi, signer);
  const tx = await contract.claim(index);
  await tx.wait();
  alert(`✅ Claimed stake #${index}`);
  setClaimingIndex(null);
} catch (err) {
  console.error('Claim failed:', err);
  alert('❌ Claim failed.');
  setClaimingIndex(null);
}

};

return ( <div className="claim-container"> 
<h3 className="section-title">Claim Available Rewards</h3> 
{stakes.length === 0 ? ( <p>No stakes found.</p> ) : ( <ul> {stakes.map((s) => 
( <li key={s.index} className="glow-subframe">
   <strong>Amount:</strong> {s.amount} HFV<br />
    <strong>Unlocks:</strong> 
    {new Date(s.unlockTime * 1000).toLocaleDateString()}<br /> 
    <strong>Claimed:</strong> {s.claimed ? 'Yes' : 'No'}
     {s.isClaimable && !s.claimed && ( <button className="claim-button" onClick={() => handleClaim(s.index)}
      disabled={claimingIndex === s.index} >
         {claimingIndex === s.index ? 'Claiming...' : 'Claim'} 
         </button> 
         )
         } 
         </li> 
         )
        )
        } 
        </ul> 
        )
        } 
        </div> 
        
      ); 
    }

