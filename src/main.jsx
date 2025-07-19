import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "./walletConnectConfig";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <App />
    </WagmiProvider>
  </React.StrictMode>
);
