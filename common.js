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
    // 注意：不要在 common.js 中设置 $axios，已经在 main.js 中设置了
    // 保留 Storage 相关方法
    app.config.globalProperties.$setSessionStorage = common.setSessionStorage
    app.config.globalProperties.$getSessionStorage = common.getSessionStorage
    app.config.globalProperties.$setLocalStorage = common.setLocalStorage
    app.config.globalProperties.$getLocalStorage = common.getLocalStorage
    app.config.globalProperties.$removeLocalStorage = common.removeLocalStorage
  }
}