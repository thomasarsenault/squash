import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';

import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    }),
    vueJsx(),
    Components({
      resolvers: [PrimeVueResolver()]
    }),
    VitePWA({ 
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Squash',
        short_name: 'Squash',
        description: 'Squash App',
        theme_color: '#8b5cf6',
        icons: [
          {
            src: 'web-app-manifest-192x192', // Path to your icon file
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'web-app-manifest-512x512', // Path to your icon file
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'web-app-manifest-512x512', // For Apple devices
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      devOptions: {
        enabled: true
      },
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/scss/global.scss";`
      }
    }
  }
})

// target: 'http://159.203.18.242:3000',