import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { host: '0.0.0.0', allowedHosts: true, historyApiFallback: true },
  preview: { host: '0.0.0.0', allowedHosts: true },
  build: {
    // The WebGL stack is lazy-loaded away from the initial page; its combined transfer is about 265 KB gzip.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep the WebGL runtime lazy and isolated from the page's initial JS.
          if (id.includes('/node_modules/three/')) return 'three-vendor';
        },
      },
    },
  },
});
