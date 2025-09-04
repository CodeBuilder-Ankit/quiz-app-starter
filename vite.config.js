import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',     // expose to other devices on network
    port: 5174,          // fixed port
    allowedHosts: ['.ngrok-free.app'] // allow all ngrok domains
  }
})
