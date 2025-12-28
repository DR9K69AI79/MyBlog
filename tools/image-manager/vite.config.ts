import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: './client',
  server: {
    port: 5173,
    proxy: {
      // 将 API 请求代理到后端
      '/api': {
        target: 'http://localhost:3456',
        changeOrigin: true,
      },
      // 图片预览代理
      '/preview': {
        target: 'http://localhost:3456',
        changeOrigin: true,
      },
      // 发布的图片预览
      '/projects': {
        target: 'http://localhost:3456',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../dist/client',
  },
})
