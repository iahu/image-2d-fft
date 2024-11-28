import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path, { dirname } from 'node:path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
