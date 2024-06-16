import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
    },
  },
  plugins: [react(), svgr()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          mui: ['@mui/material'],
          xDate: ['@mui/x-data-grid', '@mui/x-date-pickers'],
          icon: ['@mui/icons-material'],
          react: ['react', 'react-dom', 'react-router-dom'],
          store: ['@reduxjs/toolkit', 'react-redux'],
          utils: ['lodash', 'dayjs'],
        },
      },
    },
  },
});
