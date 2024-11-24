import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build : {
    ssr : 'src/entry-server.jsx',
    rollupOptions : '/index.html'
  }
});
