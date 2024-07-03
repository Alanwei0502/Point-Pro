import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
    },
  },
  plugins: [react(), svgr()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('@mui/material')) {
            return 'mui-' + id.split('/').slice(-1)[0];
          }
          if (id.includes('@mui/icons-material')) {
            return 'mui-icons';
          }
          if (id.includes('@mui/x-date-pickers')) {
            return 'xDate';
          }
          if (id.includes('@mui/x-data-grid')) {
            return 'xGrid';
          }
          if (id.includes('react')) {
            return 'react';
          }
          if (id.includes('@reduxjs/toolkit')) {
            return 'store';
          }
          if (id.includes('lodash')) {
            return 'lodash';
          }
          if (id.includes('dayjs')) {
            return 'dayjs';
          }
          if (id.includes('qrcode.react')) {
            return 'qrcode';
          }
          if (id.includes('react-toastify')) {
            return 'react-toastify';
          }
          if (id.includes('@dnd-kit')) {
            return 'dnd';
          }
        },
        // {
        // muiStyle: ['@mui/material/styles', '@mui/material/CssBaseline'],
        // mui: ['@mui/material'],
        // xDate: ['@mui/x-date-pickers'],
        // xGrid: ['@mui/x-data-grid'],
        // icon: ['@mui/icons-material'],
        // react: ['react', 'react-dom', 'react-router-dom'],
        // store: ['@reduxjs/toolkit', 'react-redux'],
        // utils: ['lodash', 'dayjs', 'qrcode.react', 'react-toastify'],
        // dnd: ['@dnd-kit/core', '@dnd-kit/modifiers', '@dnd-kit/sortable', '@dnd-kit/utilities'],
        // },
      },
    },
  },
});
