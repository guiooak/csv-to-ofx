import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Production build is served from GitHub Pages at /csv-to-ofx/
  base: command === 'build' ? '/csv-to-ofx/' : '/',
}))
