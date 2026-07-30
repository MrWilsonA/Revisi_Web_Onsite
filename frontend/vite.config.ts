import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 3000,
    allowedHosts: true,
    proxy: {
      '/seaweed': {
        target: 'http://seaweedfs-master:9333',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/seaweed/, '')
      },
      '/volume': {
        target: 'http://seaweedfs-volume:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/volume/, '')
      }
    }
  }
})