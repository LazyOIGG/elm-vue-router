import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import common from './utils/common'
import request from './utils/request'
import ElementPlus from 'element-plus'
import 'uno.css'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.config.globalProperties.$axios = request

app.use(router)
app.use(common)
app.use(ElementPlus)

app.mount('#app')