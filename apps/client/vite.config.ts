/// <reference types='vitest' />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import ViteSitemap from 'vite-plugin-sitemap';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['VITE_', '']);

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/client',
    assetsInclude: ['**/*.svg'],
    server: {
      port: parseInt(env.PORT || '4200'),
      host: '0.0.0.0',
      proxy: {
        '/api': env.VITE_API_URL,
        '/ph': {
          target: env.VITE_PUBLIC_POSTHOG_HOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ph/, ''),
        },
      },
      allowedHosts: ['donohub.srv-lab.work', 'future.donohub.srv-lab.work'],
    },
    preview: {
      port: parseInt(env.PORT || '4300'),
      host: '0.0.0.0',
      proxy: {
        '/api': env.VITE_API_URL,
        '/ph': {
          target: env.VITE_PUBLIC_POSTHOG_HOST,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/ph/, ''),
        },
      },
      allowedHosts: ['donohub.srv-lab.work', 'future.donohub.srv-lab.work'],
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        injectRegister: 'auto',
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'service-worker.ts',
        devOptions: { enabled: true },
        injectManifest: {
          injectionPoint: undefined,
        },
        includeAssets: [
          'favicon.ico',
          'home1.jpg',
          'mainx192.png',
          'mainx512.png',
        ],
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        },
        manifest: {
          name: 'DonoHUB',
          short_name: 'DonoHUB',
          description:
            'Donohub is a platform that allow people to connect and share items',
          theme_color: '#1e2939',
          icons: [
            {
              src: 'assets/mainx192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'assets/mainx512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
      ViteSitemap({
        hostname: 'https://donohub.srv-lab.work',
        generateRobotsTxt: true,
      }),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: 'Donohub',
            description:
              'Donohub is a platform that allow people to connect and share items',
          },
        },
      }),
    ],
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
