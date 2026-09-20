import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  resolve: {
    alias: {
      '@api' : path.resolve(import.meta.dirname, 'src/api'),
      '@hooks': path.resolve(import.meta.dirname, 'src/hooks'),
      '@components': path.resolve(import.meta.dirname, 'src/components'),
      '@contexts': path.resolve(import.meta.dirname, 'src/contexts'),
      '@layouts': path.resolve(import.meta.dirname, 'src/layouts'),
      '@pages': path.resolve(import.meta.dirname, 'src/pages'),
      '@utils': path.resolve(import.meta.dirname, 'src/utils'),
      '@common': path.resolve(import.meta.dirname, 'src/components/common'),
      '@features': path.resolve(import.meta.dirname, 'src/components/features'),
    },
  },
})
