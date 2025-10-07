import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    
    headers: {
      // 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      // 'Pragma': 'no-cache',
      'Expires': '0'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  // Disable build cache
  build: {
    rollupOptions: {
      output: {
        // Bỏ hash để không có timestamp
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js', 
        assetFileNames: '[name].[ext]'
      }
    }
  }
})
