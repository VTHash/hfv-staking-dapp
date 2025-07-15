import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'public/_redirects',
          dest: '.' 
        }
      ]
    })
  ]
});