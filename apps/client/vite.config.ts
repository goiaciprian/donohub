/// <reference types='vitest' />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['VITE_', '']);

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/client',
    server: {
      port: parseInt(env.PORT || '4200'),
      host: '0.0.0.0',
      proxy: {
        '/api': env.VITE_API_URL,
      },
      allowedHosts: ['donohub.srv-lab.work'],
    },
    preview: {
      port: parseInt(env.PORT || '4300'),
      host: '0.0.0.0',
      proxy: {
        '/api': env.VITE_API_URL,
      },
      allowedHosts: ['donohub.srv-lab.work'],
    },
    plugins: [react(), tailwindcss(), VitePWA({ injectRegister: 'auto' })],
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    build: {
      outDir: './dist',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
