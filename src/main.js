import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import common from '../common.js'
import axios from 'axios'

import 'font-awesome/css/font-awesome.min.css'

const app = createApp(App)

axios.defaults.baseURL = 'http://localhost:8085/elm_api'
app.config.globalProperties.$axios = axios

app.use(router)
app.use(common)

app.mount('#app')