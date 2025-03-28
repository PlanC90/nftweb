import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react', 'uuid'],
  },
  server: {
    proxy: {
      '/data': 'http://localhost:3000',
      'ws://nft.memextoken.org:24678': {
        target: 'wss://nft.memextoken.org:24678',
        secure: true,
        ws: true,
      }
    },
    hmr: {
      overlay: false,
      protocol: 'ws',
    },
    allowedHosts: ["nft.memextoken.org"],
    https: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  base: '/',
});
