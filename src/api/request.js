import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message, MessageBox } from 'element-ui'
import { spliceErrorHtml } from '@/utils/common'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.BASE_API,
  baseURL: 'http://api.strayjoke.test/admin/', // api 的 base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers.common['Authorization'] = `Bearer ${store.state.auth.token}`
    return config
  },
  error => {
    // Do something with request error
    Promise.reject(error)
  }
)

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers.common['Authorization'] = `Bearer ${store.state.auth.token}`
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const token = response.headers.authorization
    if (token && token !== store.state.auth.token) {
      // 如果 header 中存在 token，那么替换本地的 token
      store.commit('SET_TOKEN', token)
    }
    return response
  },

  error => {
      return Promise.reject(error.response.data)
  }
)

export default service

