import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // ADD THIS
    port: 5173,        // Optional if you want fixed port
    strictPort: true, 
    historyApiFallback: true // Optional - if port is busy, don't auto change
  }
})
