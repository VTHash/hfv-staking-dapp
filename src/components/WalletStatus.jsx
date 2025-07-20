import { useAccount } from 'wagmi'

export default function WalletStatus() {
  const { address, isConnected } = useAccount()
  if (!isConnected) return null

  return (
    <div style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#00ff99' }}>
      Connected: {address.slice(0, 6)}...{address.slice(-4)}
    </div>
  )
}