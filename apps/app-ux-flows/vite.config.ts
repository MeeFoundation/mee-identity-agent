import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const fromSrc = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/app': fromSrc('app'),
      '@/routes': fromSrc('routes'),
      '@/shared': fromSrc('shared'),
      '@/slices': fromSrc('slices'),
    },
  },
})
