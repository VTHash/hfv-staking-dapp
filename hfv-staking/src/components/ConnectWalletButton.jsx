// src/components/ConnectWalletButton.jsx
import React from "react";
import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export default function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  return (
    <div className="mt-4">
      {isConnected ? (
        <button
          onClick={() => disconnect()}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Disconnect ({address.slice(0, 6)}...{address.slice(-4)})
        </button>
      ) : (
        <button
          onClick={() => connect()}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}