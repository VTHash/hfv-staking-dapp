import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { WagmiConfig } from 'wagmi';
import { wagmiConfig } from './walletConnectConfig'; // path may vary

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <App />
    </WagmiConfig>
  </React.StrictMode>
);