import { defineConfig, type PluginOption } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
    },
  },
  plugins: [react(), svgr(), visualizer() as PluginOption],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          muiStyle: ['@mui/material/styles', '@mui/material/CssBaseline'],
          mui: ['@mui/material'],
          xDate: ['@mui/x-date-pickers'],
          xGrid: ['@mui/x-data-grid'],
          icon: ['@mui/icons-material'],
          react: ['react', 'react-dom', 'react-router-dom'],
          store: ['@reduxjs/toolkit', 'react-redux'],
          dayjs: ['dayjs'],
          qrcode: ['qrcode.react'],
          toast: ['react-toastify'],
          dnd: ['@dnd-kit/core', '@dnd-kit/modifiers', '@dnd-kit/sortable', '@dnd-kit/utilities'],
        },
      },
    },
  },
});
