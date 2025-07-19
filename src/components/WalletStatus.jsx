import { useAccount } from 'wagmi';

const WalletStatus = () => {
  const { address, isConnected } = useAccount();

  return (
    <div className="text-center">
      {isConnected ? (
        <div>
          <p className="text-green-400">Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>
        </div>
      ) : (
        <w3m-button />
      )}
    </div>
  );
};

export default WalletStatus;