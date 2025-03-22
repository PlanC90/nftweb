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
            target: 'https://localhost:3000',
            secure: true,
          },
          '/socket.io': {
            target: 'wss://localhost:3000',
            ws: true,
            secure: true,
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
    });
