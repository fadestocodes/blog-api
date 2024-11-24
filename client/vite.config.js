import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({mode}) =>{
  const isSSR = mode === 'ssr';
  return {
    plugins : [react()],
    build : {
      ssr : isSSR ? './src/entry-server.jsx' : false,
      outDir : isSSR ? './dist/server' : './dist/client',
      rollupOptions : {
        input : isSSR ? './src/entry-server.jsx' : './index.html'
      }
    }
  }
})