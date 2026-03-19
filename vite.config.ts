import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
  const geminiApiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || env.API_KEY || '';
  const geminiFlashModel = env.VITE_GEMINI_FLASH_MODEL || 'gemini-2.5-flash';
  const geminiProModel = env.VITE_GEMINI_PRO_MODEL || 'gemini-2.5-pro';
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:8000',
            changeOrigin: true,
          },
        },
      },
      plugins: [react()],
      define: {
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(geminiApiKey),
        'import.meta.env.VITE_GEMINI_FLASH_MODEL': JSON.stringify(geminiFlashModel),
        'import.meta.env.VITE_GEMINI_PRO_MODEL': JSON.stringify(geminiProModel)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
