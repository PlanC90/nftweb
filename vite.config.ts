import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['lucide-react', 'uuid'],
  },
  server: {
    proxy: {
      '/data': {
        target: 'https://nft.memextoken.org',
        secure: true,
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'wss://nft.memextoken.org',
        ws: true,
        secure: true,
        changeOrigin: true,
      }
    },
    hmr: {
      overlay: false,
    },
    allowedHosts: ["nft.memextoken.org"]
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
  define: {
    'global': 'window',
  },
});
