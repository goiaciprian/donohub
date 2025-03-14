/// <reference types='vitest' />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/client',
    server: {
      port: parseInt(env.PORT || '4200'),
      host: 'localhost',
      proxy: {
        '/api': 'http://localhost:3001',
      },
    },
    preview: {
      port: parseInt(env.PORT || '4300'),
      host: 'localhost',
    },
    plugins: [react(), tailwindcss()],
    // Uncomment this if you are using workers.
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
