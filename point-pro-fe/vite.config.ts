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
          '@mui/material': ['@mui/material'],
          '@mui/x-date-pickers': ['@mui/x-date-pickers'],
          '@mui/x-data-grid': ['@mui/x-data-grid'],
          '@dnd-kit': ['@dnd-kit/core', '@dnd-kit/modifiers', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          'qrcode.react': ['qrcode.react'],
          dayjs: ['dayjs'],
        },
      },
    },
  },
});
