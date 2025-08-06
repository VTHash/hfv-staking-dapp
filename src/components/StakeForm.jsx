import React, { useState } from 'react'; 
import { ethers, BrowserProvider } from 'ethers'; 
import EthereumProvider from '@walletconnect/ethereum-provider'; 
import stakingAbi from '../abi/HFVStaking.json'; 
import tokenAbi from '../abi/HFVToken.json';

const stakingAddress = import.meta.env.VITE_HFV_STAKING_ADDRESS; 
const tokenAddress = import.meta.env.VITE_HFV_TOKEN_ADDRESS;

export default function StakeForm() { 
  const [amount, setAmount] = useState(''); 
  const [duration, setDuration] = useState(''); 
  const [status, setStatus] = useState('');

const handleStake = async () => { if (!stakingAddress || !tokenAddress || !amount || !duration) return;

 console.log("🔍 tokenAddress:", tokenAddress);
console.log("🔍 stakingAddress:", stakingAddress);
console.log("🔍 tokenAbi:", tokenAbi);
console.log("🔍 stakingAbi:", stakingAbi);
console.log("stakingAbi raw:", stakingAbi);
console.log("stakingAbi is array?", Array.isArray(stakingAbi));
console.log("tokenAbi raw:", tokenAbi);
console.log("tokenAbi is array?", Array.isArray(tokenAbi));
                                 
try {
  const stakeAmount = parseFloat(amount);
  if (stakeAmount > 500) {
    setStatus('❌ Max 500 HFV per period');
    return;
  }

  setStatus('🔄 Connecting...');

  let provider;
  if (window.ethereum) {
    provider = new BrowserProvider(window.ethereum);
  } else {
    provider = await EthereumProvider.init({
      projectId: import.meta.env.VITE_PROJECT_ID,
      chains: [1],
      showQrModal: true,
      methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData'],
    });
    await provider.enable();
    provider = new BrowserProvider(provider);
  }

  const signer = await provider.getSigner();
  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
  const stakingContract = new ethers.Contract(stakingAddress, stakingAbi, signer);

  const amountInWei = ethers.parseUnits(amount, 18);
  setStatus('📝 Approving HFV...');
  const approvalTx = await tokenContract.approve(stakingAddress, amountInWei);
  await approvalTx.wait();

  setStatus('⏳ Staking in progress...');
  const stakeTx = await stakingContract.stake(amountInWei, Number(duration));
  await stakeTx.wait();

  setStatus('✅ Stake successful!');
  setAmount('');
  setDuration('');
catch (err) {
  console.error("Stake Error:", err);
  setStatus(`❌ Stake failed: ${err?.reason || err?.message || JSON.stringify(err)}`);
}

};

return ( <div className="stake-form">
   <h3 className="section-title">Stake HFV Tokens</h3>
    <input className="input-field" type="number" placeholder="Amount to stake" 
    value={amount} onChange={(e) => setAmount(e.target.value)} /> 
    <select className="input-field" value={duration} onChange={(e) => setDuration(e.target.value)} >
       <option value="">Select Lock Duration</option> 
       <option value={21 * 86400}>21 Days</option> 
       <option value={3 * 30 * 86400}>3 Months</option>
        <option value={6 * 30 * 86400}>6 Months</option>
         <option value={12 * 30 * 86400}>12 Months</option> 
         </select> <button className="glow-button" onClick={handleStake}> Stake </button>
          <p className="status-text">{status}
            </p> 
            </div> 
            );
           }

