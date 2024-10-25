import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Vite's default port
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Your backend server
        changeOrigin: true,
        secure: false,
      },
    },
    hmr: {
      protocol: 'ws', // or 'wss' for secure connections
      host: 'localhost',
      port: 5173,
    }, // <-- Missing this closing brace
  },
});
