import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  base: '/image-2d-fft/',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
