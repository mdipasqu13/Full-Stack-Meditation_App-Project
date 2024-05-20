import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // This will allow you to use '@' to import from the 'src' directory
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Replace with your Flask backend URL
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove '/api' prefix from the request URL
      },
    },
  },
});