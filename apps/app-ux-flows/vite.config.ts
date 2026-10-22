import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const fromSrc = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@/app': fromSrc('app'),
      '@/routes': fromSrc('routes'),
      '@/shared': fromSrc('shared'),
      '@/slices': fromSrc('slices'),
    },
  },
  server: {
    port: 5179,
  },
  test: {
    // Keeps a local Matomo setup in .env.local from loading the browser-only adapter in Node.
    env: { VITE_MATOMO_URL: '' },
  },
})
