import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import common from './utils/common'
import request from './utils/request'

import 'font-awesome/css/font-awesome.min.css'

const app = createApp(App)

app.config.globalProperties.$axios = request

app.use(router)
app.use(common)

app.mount('#app')