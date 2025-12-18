// common.js - 全局公共方法
import axios from 'axios'
import qs from 'qs'

// 设置axios默认配置
axios.defaults.baseURL = 'http://localhost:8081/elm/'  // 注意这里要指向本地代理
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

const common = {
  // 设置sessionStorage
  setSessionStorage(key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  },

  // 获取sessionStorage
  getSessionStorage(key) {
    const value = window.sessionStorage.getItem(key)
    return value ? JSON.parse(value) : null
  },

  // 设置localStorage
  setLocalStorage(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  },

  // 获取localStorage
  getLocalStorage(key) {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  },

  // 移除localStorage
  removeLocalStorage(key) {
    window.localStorage.removeItem(key)
  }
}

// 挂载到Vue原型
export default {
  install(app) {
    app.config.globalProperties.$axios = axios
    app.config.globalProperties.$qs = qs
    app.config.globalProperties.$setSessionStorage = common.setSessionStorage
    app.config.globalProperties.$getSessionStorage = common.getSessionStorage
    app.config.globalProperties.$setLocalStorage = common.setLocalStorage
    app.config.globalProperties.$getLocalStorage = common.getLocalStorage
    app.config.globalProperties.$removeLocalStorage = common.removeLocalStorage
  }
}