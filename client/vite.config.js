import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_CLIENT_PORT) || 3210,
      host: true,
      
      headers: {
        // 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        // 'Pragma': 'no-cache',
        'Expires': '0'
      },
      proxy: {
        '/api': {
          target: env.VITE_API_BASE || 'http://localhost:4321',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    // Add preview server configuration for production
    preview: {
      port: process.env.PORT || 4173,
      host: '0.0.0.0',
      allowedHosts: [
        'thuan-client-9a13f65bae85.herokuapp.com',
        'localhost',
        '127.0.0.1'
      ]
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
  }
})
