import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/predict_image': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/predict_video': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/submit_report': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/static': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      }
    }
  }
})
