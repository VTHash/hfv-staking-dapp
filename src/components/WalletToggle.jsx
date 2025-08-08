import { useState } from 'react';

export default function WalletToggle({ onSelect, initial = 'metamask' }) {
  const [selected, setSelected] = useState(initial);

  const choose = (val) => {
    setSelected(val);
    onSelect?.(val);
  };

  return (
    <div className="wallet-toggle" style={{ display: 'flex', gap: 8, margin: '8px 0' }}>
      <button
        type="button"
        className={`glow-button ${selected === 'metamask' ? 'active' : ''}`}
        onClick={() => choose('metamask')}
      >
        MetaMask
      </button>
      <button
        type="button"
        className={`glow-button ${selected === 'walletconnect' ? 'active' : ''}`}
        onClick={() => choose('walletconnect')}
      >
        WalletConnect
      </button>
    </div>
  );
}
