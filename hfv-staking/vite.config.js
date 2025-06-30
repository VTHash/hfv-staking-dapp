// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        "wagmi",
        "@wagmi/core",
        "@web3modal/ethereum",
        "@web3modal/react"
      ],
    },
  },
});