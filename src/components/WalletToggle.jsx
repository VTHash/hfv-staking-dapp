// WalletToggle.jsx import React, { useState } from 'react';

export default function WalletToggle({ onSelect }) 
{ 
const [selected, setSelected] = useState('metamask');

const handleSelect = (wallet) => { setSelected(wallet); 
    onSelect(wallet); };

return ( <div className="wallet-toggle">
     <button className={selected === 'metamask' ? 'active' : ''} onClick={() =>
     handleSelect('metamask')} > MetaMask </button>
      <button className={selected === 'walletconnect' ? 'active' : ''} onClick={() => 
      handleSelect('walletconnect')} > WalletConnect </button> 
      </div> 
      );
     }
