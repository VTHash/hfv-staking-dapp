import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import netlify from 'vite-plugin-netlify';

export default defineConfig({
  plugins: [react(), netlify()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html', // This must be relative to root
    },
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
});