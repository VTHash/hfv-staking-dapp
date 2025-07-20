# 🚀 HFV Staking DApp

A decentralized application built to allow users to stake HFV tokens, view reward estimates, and interact with Ethereum Mainnet using RainbowKit and Wagmi.

### 🌐 Live Features
- 🔐 Wallet connect via RainbowKit + WalletConnect
- 🧮 Staking reward calculator (based on HFV formula)
- 📡 Network detection (Ethereum Mainnet only)
- 👛 Wallet address + status display
- ⚙️ Modular structure for future on-chain staking, unstaking, and dashboards
### 🧠 Staking Formula
| Duration | Multiplier |
|------------|------------|
| 21 Days | 1 |
| 3 Months | 3 |
| 6 Months | 6 |
| 12 Months | 12 |

Example: Staking `120 HFV` for `3 months`  
`120 × 0.4 × 17.38 × 3 = 2506.56 HFV`

### 🛠 Tech Stack

- [Vite](https://vitejs.dev/) (React + JS)
- [RainbowKit](https://rainbowkit.com/)
- [Wagmi](https://wagmi.sh/)
- [Ethers.js](https://docs.ethers.org/)
- [WalletConnect](https://walletconnect.com/)
- Ethereum Mainnet

### ⚙️ Local Setup
