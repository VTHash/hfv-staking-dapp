import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import {
  Web3Modal,
  EthereumClient
} from "@web3modal/ethereum";
import { Web3Modal as Modal } from "@web3modal/react";
import { wagmiConfig, ethereumClient, projectId } from "./walletConnectConfig";

import { WagmiConfig } from "wagmi";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <App />
      <Modal projectId={projectId} ethereumClient={ethereumClient} />
    </WagmiConfig>
  </React.StrictMode>
);