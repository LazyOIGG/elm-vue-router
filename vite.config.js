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
        port: 8081,
        host: 'localhost',
        open: false,
        // 添加代理配置
        proxy: {
            '/elm': {  // 代理所有以 /elm 开头的请求
                target: 'http://localhost:8080',  // 后端服务器地址
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/elm/, '')
            }
        }
    }
})