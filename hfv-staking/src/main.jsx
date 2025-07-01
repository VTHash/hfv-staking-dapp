import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  Web3Modal,
  WagmiConfig,
  wagmiConfig,
  ethereumClient,
  projectId,
} from "./walletConnectConfig";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <App />
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </WagmiConfig>
  </React.StrictMode>
);