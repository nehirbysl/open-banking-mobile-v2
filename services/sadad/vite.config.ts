import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3003,
    proxy: {
      '/api/consent': {
        target: 'https://qantara.tnd.bankdhofar.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/consent/, '/consents'),
        secure: false,
      },
      '/api/banking': {
        target: 'https://qantara.tnd.bankdhofar.com',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/banking/, '/banking'),
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
