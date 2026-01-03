import axios from 'axios'

// 创建 axios 实例
/*
通过在这里切换后端端口使用不同版本的后端服务
1. localhost:8084: Servlet版
2. localhost:8085: SpringBoot版
*/

const request = axios.create({
  baseURL: 'http://localhost:8085/elm_api',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从sessionStorage获取token
    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }

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
    // 检查响应中是否包含新的token（如果有的话）
    if (response.data && response.data.token) {
      sessionStorage.setItem('token', response.data.token)
    }
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
      // 清除本地token
      sessionStorage.removeItem('token')
      // 未授权，跳转到登录页
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default request