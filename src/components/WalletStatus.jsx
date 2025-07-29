import React, { useEffect, useState } from 'react';

export default function WalletStatus() {
  const [account, setAccount] = useState('');

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount('');
        }
      });
    }
  }, []);

  return (
    <div className="status-text">
      {account ? (
        <>✅ Wallet: <strong>{account.slice(0, 6)}...{account.slice(-4)}</strong></>
      ) : (
        <span>⚠️ Wallet not connected</span>
      )}
    </div>
  );
}
