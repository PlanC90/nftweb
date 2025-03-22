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
            target: 'http://localhost:3000',
            secure: false, // set to true if your target is HTTPS
          },
          '/socket.io': { // If you are using socket.io
            target: 'ws://localhost:3000',
            ws: true,
            secure: false, // set to true if your target is WSS
          }
        },
        hmr: {
          overlay: false,
          protocol: 'ws',
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
