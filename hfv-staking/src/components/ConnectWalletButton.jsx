import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function ConnectWalletButton({ onConnect }) {
  const [account, setAccount] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          onConnect?.(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, [onConnect]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus("❌ MetaMask not installed");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setStatus("✅ Connected");
      onConnect?.(accounts[0]);
    } catch (err) {
      setStatus("❌ Connection rejected");
    }
  };

  return (
    <div className="mb-4 text-sm">
      {account ? (
        <p className="text-green-500">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      )}
      {status && <p className="mt-1">{status}</p>}
    </div>
  );
}
