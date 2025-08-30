import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ethers } from "ethers";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState(null); // ethers.BrowserProvider
  const [status, setStatus] = useState("");

  // Connect via injected wallet (MetaMask or compatible)
  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus("❌ MetaMask not available");
      throw new Error("MetaMask not available");
    }
    setStatus("🔄 Connecting wallet…");
    const acc = await window.ethereum.request({ method: "eth_requestAccounts" });
    const injected = new ethers.BrowserProvider(window.ethereum);
    const signer = await injected.getSigner();
    const addr = await signer.getAddress(); // canonical 0x address
    setProvider(injected);
    setAddress(addr);
    setStatus("✅ Connected");
    // optional: let other components know (if any still listen)
    window.dispatchEvent(new CustomEvent("hfv:wallet-connected", { detail: { addr } }));
    return addr;
  };

  const value = useMemo(() => ({
    address,
    provider,
    status,
    connectWallet,
    // expose setters only if you need (hidden here to keep API simple)
  }), [address, provider, status]);

  // Keep context in sync with wallet events
  useEffect(() => {
    if (!window.ethereum) return;
    const onAccounts = async (accs) => {
      if (!accs || accs.length === 0) {
        setAddress("");
        setProvider(null);
        setStatus("ℹ Wallet disconnected");
        window.dispatchEvent(new Event("hfv:wallet-disconnected"));
        return;
      }
      const injected = new ethers.BrowserProvider(window.ethereum);
      const signer = await injected.getSigner();
      const addr = await signer.getAddress();
      setProvider(injected);
      setAddress(addr);
      setStatus("✅ Connected");
      window.dispatchEvent(new CustomEvent("hfv:wallet-connected", { detail: { addr } }));
    };
    const onChain = () => {
      // provider stays valid; components can refetch if needed
      window.dispatchEvent(new Event("hfv:wallet-connected"));
    };
    window.ethereum.on?.("accountsChanged", onAccounts);
    window.ethereum.on?.("chainChanged", onChain);
    return () => {
      window.ethereum.removeListener?.("accountsChanged", onAccounts);
      window.ethereum.removeListener?.("chainChanged", onChain);
    };
  }, []);

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export const useWallet = () => useContext(WalletContext);