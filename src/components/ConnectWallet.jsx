import React, { useState } from 'react';
import { BrowserProvider } from 'ethers';
import EthereumProvider from '@walletconnect/ethereum-provider';

export default function ConnectWallet({ onWalletConnected }) {
  const [address, setAddress] = useState(null);

  const connectWalletConnect = async () => {
    try {
      const provider = await EthereumProvider.init({
        projectId: import.meta.env.VITE_PROJECT_ID,
        chains: [1],
        showQrModal: true,
        methods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData'],
      });

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

  return (
    <>
    {!address ? (
      <button className="glow-button" onClick={connectWalletConnect}>
        <img
          src="/wallett-connect-logo.png"
          alt="WalletConnect"
          className="walletconnect-icon"
        />
        Connect Wallet
      </button>
    ) : (
      <p className="status-text">
        Connected: <strong>{address.slice(0, 6)}...{address.slice(-4)}</strong>
      </p>
    )}
  </>
);
}
