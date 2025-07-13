import { useConnect, useAccount, useDisconnect } from 'wagmi'

export default function ConnectWalletButton() {
  const { connectors, connect, error } = useConnect()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <button onClick={() => disconnect()}>
        Disconnect {address?.slice(0,6)}…{address?.slice(-4)}
      </button>
    )
  }

  return (
    <div>
      {connectors.map((c) => (
        <button key={c.id} onClick={() => connect({ connector: c })}>
          Connect with {c.name}
        </button>
      ))}
      {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
    </div>
  )
}