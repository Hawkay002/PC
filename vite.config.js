import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to the serverless dev environment during local development
      '/api': {
        target: 'http://localhost:3000', // Assuming your local serverless CLI runs on 3000
        changeOrigin: true,
      }
    }
  }
})
