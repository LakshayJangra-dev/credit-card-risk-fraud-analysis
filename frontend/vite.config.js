import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Forward API calls to the Flask backend during local dev
      '/credit': 'http://localhost:5000',
      '/fraud': 'http://localhost:5000',
      '/combined': 'http://localhost:5000',
      '/health': 'http://localhost:5000',
      '/auth': 'http://localhost:5000',
    },
  },
})
