import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

const projectId = import.meta.env.VITE_PROJECT_ID;

const ConnectWalletButton = () => {
  const { address, isConnected } = useAccount();

  const { connect } = useConnect({
    connector: new WalletConnectConnector({
      options: {
        projectId,
        metadata: {
          name: 'HFV DApp',
          description: 'Stake your HFV tokens and earn rewards',
          url: 'https://hfv-staking-dapp.netlify.app',
          icons: ['https://hfv-staking-dapp.netlify.app/logo.png'],
        },
      },
    }),
  });

  const { disconnect } = useDisconnect();

  return (
    <div className="mt-4">
      {isConnected ? (
        <button
          onClick={() => disconnect()}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Disconnect {address?.slice(0, 6)}...
        </button>
      ) : (
        <button
          onClick={() => connect()}
          className="bg-lime-400 text-black px-4 py-2 rounded-md hover:bg-lime-300"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectWalletButton;