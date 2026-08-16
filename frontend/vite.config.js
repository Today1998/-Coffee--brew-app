import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev
export default defineConfig({
  plugins: [react()],
  base: '/', // 🌟 Fixes blank screens by ensuring asset paths generate relative to the root
  server: {
    proxy: {
      '/api': {
        target: 'https://onrender.com', // Links directly to your live Render backend
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
