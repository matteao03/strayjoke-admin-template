import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import store from './store/index'
import '@/icons'
import '@/assets/css/common.scss'
// import Mock from '@/mock'

// Mock.mockData()

Vue.config.productionTip = false
// Vue.config.silent = true // 取消 Vue 所有的日志与警告

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
