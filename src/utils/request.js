import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message, MessageBox } from 'element-ui'
import { spliceErrorHtml } from '@/utils/common'

// create an axios instance
const service = axios.create({
  baseURL: '/', // api 的 base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers.common['X-Auth-Token'] = store.state.auth.token
    return config
  },
  error => {
    // Do something with request error
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
    return response.data
  },

  error => {
    store.state.common.isLoading = 0 // 取消loading
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          MessageBox.confirm('会话过期，请重新登录', '确认', {
            confirmButtonText: '重新登录',
            showCancelButton: false,
            showClose: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            type: 'warning' }
          ).then(() => {
            store.dispatch('logout').then(() => {
              router.push(`/login?from=logout`)
            })
          })
          break
        case 403:
          MessageBox.confirm(error.response.data.msg, '警告', {
            confirmButtonText: '确认',
            showCancelButton: false,
            showClose: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            type: 'warning' }
          )
          break
        case 422:
          MessageBox.confirm(spliceErrorHtml(error.response.data.errors), '错误', {
            confirmButtonText: '确认',
            showCancelButton: false,
            showClose: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            dangerouslyUseHTMLString: true,
            type: 'error' }
          )
          break
        default:
          Message({
            message: error.response.data.msg || '网络请求异常，请联系管理员！',
            type: 'error',
            duration: 3000
          })
      }
      return Promise.reject(error.response.data)
    }
  }
)

export default service
