import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8086,
    host: 'localhost',
    open: false,
    // 代理配置 - 将前端请求代理到后端
    proxy: {
      // 代理所有 Controller 请求到后端
      '/': {
        target: 'http://localhost:8085/elm_api',
        changeOrigin: true,
        // 不需要重写，直接转发请求
      }
    }
  }
})