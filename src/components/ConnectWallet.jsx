import React, { useState } from 'react'; 
import { ethers, BrowserProvider } from 'ethers'; 
import EthereumProvider from '@walletconnect/ethereum-provider'; 
import '../index.css';

export default function ConnectWallet({ onWalletConnected }) { 
  const [address, setAddress] = useState(null);

const connectWalletConnect = async () => { try { 
  const provider = await EthereumProvider.init({ 
    projectId: import.meta.env.VITE_PROJECT_ID, // from .env chains: [1], showQrModal: true, methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData'], });

await provider.enable();

  const browserProvider = new BrowserProvider(provider);
  const signer = await browserProvider.getSigner();
  const userAddress = await signer.getAddress();

  setAddress(userAddress);
  onWalletConnected?.(userAddress, browserProvider);
} catch (err) {
  console.error('WalletConnect error:', err);
}

};

return ( <div className="section-card center"> 
{!address ? ( 
  <button className="walletconnect-btn" onClick={connectWalletConnect}> 
  <img src="/wallet-connect-logo.png" alt="WalletConnect" /> 
  Connect with WalletConnect </button> ) : ( 
    <p className="status-text"> 
    ✅ Connected: <strong>{address.slice(0, 6)}...{address.slice(-4)}</strong> 
    </p> 
    )} 
    </div> 
    ); 
  }

