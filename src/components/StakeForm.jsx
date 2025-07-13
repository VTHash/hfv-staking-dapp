import { useState } from 'react';

export default function StakeForm() {
  const [amount, setAmount] = useState('');

  const handleStake = () => {
    alert(`Stake ${amount} HFV`);
    // call smart contract function here
  };

  return (
    <div>
      <input
        type="number"
        placeholder="Enter HFV amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleStake}>Stake</button>
    </div>
  );
}