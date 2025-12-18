import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import common from '../common.js'

import 'font-awesome/css/font-awesome.min.css'

const app = createApp(App)

app.use(router)
app.use(common)

app.mount('#app')
