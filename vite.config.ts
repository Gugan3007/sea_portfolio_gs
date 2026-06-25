import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '../libs/lottie.js': path.resolve(__dirname, './src/lottie-mock.js'),
    },
  },
  optimizeDeps: {
    exclude: ['three-stdlib'],
  },
})

