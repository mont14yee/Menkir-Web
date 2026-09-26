import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('recharts') || id.includes('d3-')) {
                  return 'vendor-charts';
                }
                if (id.includes('motion') || id.includes('framer-motion')) {
                  return 'vendor-motion';
                }
              }
            }
          }
        },
        chunkSizeWarningLimit: 700,
      }
    };
});
