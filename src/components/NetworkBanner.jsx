import { useChainId } from 'wagmi'
import React from 'react'

export default function NetworkBanner() {
  const chainId = useChainId()
  const isMainnet = chainId === 1

  if (isMainnet) return null

  return (
    <div style={{ backgroundColor: '#ff0055', color: '#fff', padding: '1rem', textAlign: 'center' }}>
      ⚠️ Please switch to Ethereum Mainnet to use HFV Staking DApp
    </div>
  )
}