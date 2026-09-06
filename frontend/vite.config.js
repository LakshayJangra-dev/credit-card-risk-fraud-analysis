import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Forward API calls to the Flask backend during local dev
      '/credit': 'http://127.0.0.1:5000',
      '/fraud': 'http://127.0.0.1:5000',
      '/combined': 'http://127.0.0.1:5000',
      '/health': 'http://127.0.0.1:5000',
      '/auth': 'http://127.0.0.1:5000',
    },
  },
})
