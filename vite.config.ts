import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The AI Lab backend runs as a separate compose service. In development the
// dev server proxies /api to it so browser calls stay same-origin and the
// provider API key never leaves the server. Unset (plain `npm run dev` on a
// host without the backend) means no proxy — the lab then reports honestly
// that the AI service is unreachable.
const apiProxyTarget = process.env.VITE_API_PROXY_TARGET;

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    historyApiFallback: true,
    proxy: apiProxyTarget
      ? { '/api': { target: apiProxyTarget, changeOrigin: false } }
      : undefined,
  },
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
