import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
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
        },
    },
    server: {
        port: 8086,
        host: 'localhost',
        open: false,
        // 添加代理配置
        proxy: {
            // 代理所有以 /elm_api 开头的请求
            '/elm_api': {
                target: 'http://localhost:8085',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/elm_api/, '/elm_api')
            },
            // 或者直接代理所有请求
            '/api': {
                target: 'http://localhost:8085/elm_api',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
})