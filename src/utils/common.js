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

// 添加命名导出
export function setLocalStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function getLocalStorage(key) {
  const value = window.localStorage.getItem(key)
  return value ? JSON.parse(value) : null
}

export function removeLocalStorage(key) {
  window.localStorage.removeItem(key)
}

// 添加这些命名导出
export function setSessionStorage(key, value) {
  window.sessionStorage.setItem(key, JSON.stringify(value))
}

export function getSessionStorage(key) {
  const value = window.sessionStorage.getItem(key)
  return value ? JSON.parse(value) : null
}

// 挂载到Vue原型
export default {
  install(app) {
    app.config.globalProperties.$setSessionStorage = common.setSessionStorage
    app.config.globalProperties.$getSessionStorage = common.getSessionStorage
    app.config.globalProperties.$setLocalStorage = common.setLocalStorage
    app.config.globalProperties.$getLocalStorage = common.getLocalStorage
    app.config.globalProperties.$removeLocalStorage = common.removeLocalStorage
  }
}