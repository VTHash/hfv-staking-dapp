import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Web3Button } from '@web3modal/react';

function ConnectWalletButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      ) : (
        <Web3Button />
      )}
    </div>
  );
}

export default ConnectWalletButton;