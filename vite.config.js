import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  root: 'src', // tells Vite to use /src as root
  publicDir: '../public', // serve static assets from public
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
