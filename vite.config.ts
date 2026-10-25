import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          'charts-vendor': ['recharts', 'd3'],
          'ui-vendor': ['lucide-react', 'canvas-confetti'],
        },
      },
    },
  },
});
