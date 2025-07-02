import netlify from '@netlify/vite-plugin';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  plugins: [netlify()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html' // This must be relative to root
    }
  }
})