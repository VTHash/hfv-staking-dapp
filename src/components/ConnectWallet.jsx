import React, { useState } from 'react';
import { BrowserProvider } from 'ethers';
import EthereumProvider from '@walletconnect/ethereum-provider';
import {useWallet} from '../components/WalletContext';
export default function ConnectWallet({ onWalletConnected }) {
  const [address, setAddress] = useState(null);
  const { address: ctxAddress, provider:ctxProvider, connectWallet } =useWallett();
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
  const showMetaMaskLink =
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && !window.ethereum;

return (
  <>
    {!address ? (
      <div>
        <button className="glow-button" onClick={connectWalletConnect}>
          <img
            src="/wallet-connect-logo.png"
            alt="WalletConnect"
            className="walletconnect-icon"
          />
          Connect Wallet
        </button>

        {/* ✅ Mobile fallback only when not already inside MetaMask browser */}
        {showMetaMaskLink && (
          <a
            href={`metamask://dapp/${window.location.host}`}
            className="glow-button"
            style={{ display: 'block', marginTop: '10px', textAlign: 'center' }}
          >
            Open in MetaMask
          </a>
        )}
      </div>
    ) : (
      <p className="status-text">
        Connected: <strong>{address.slice(0, 6)}...{address.slice(-4)}</strong>
      </p>
    )}
  </>
)};
