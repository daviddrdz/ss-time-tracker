import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    AstroPWA({
      registerType: 'autoUpdate',
      injectRegister: 'script',
      workbox: {
        globPatterns: ['**/*.{css,js,html,svg,png,ico,txt}'],
        skipWaiting: true,
        clientsClaim: true
      },
      manifest: {
        name: 'Servicio Social Tracker',
        short_name: 'Servicio',
        description: 'Control de horas de servicio social',
        theme_color: '#09090b',
        background_color: '#09090b',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
