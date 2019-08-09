import Vue from 'vue'
import Router from 'vue-router'
import { staticRoutes} from './routes'

Vue.use(Router)
const router = new Router({
  mode: 'history',
  base: '/vue/',
  routes: staticRoutes
})

// 前置导航守卫
router.beforeEach((to, from, next) => {
  const app = router.app
  const store = app.$options.store
  const auth = store.state.auth

  if (auth.token) {
    if (to.path === '/login') {
      next(from.path)
    } else {
      if (auth.id === 0) { // 判断是否拉取完用户信息
        store.dispatch('getManagerInfo').then(() => {
          next()
        })
      } else {
        next()
      }
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next(`/login`)
    }
  }
})

export default router
