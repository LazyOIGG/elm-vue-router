import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8085/elm_api',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    if (['post', 'put', 'delete'].includes(config.method)) {
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 直接返回数据部分
    return response.data
  },
  error => {
    console.error('API请求错误:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    })

    // 统一错误处理
    if (error.response?.status === 401) {
      // 未授权，跳转到登录页
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default request