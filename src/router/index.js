import Vue from 'vue'
import Router from 'vue-router'
import { staticRoutes} from './routes'
import routeUtils from '@/utils/routeUtils'
import { hasPermission } from '@/utils/common'

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
      if (auth.roles.length === 0) { // 判断是否拉取完用户角色信息
        store.dispatch('getUserInfo').then(() => {
          store.dispatch('getPermissions').then(res => {
            staticRoutes.forEach((item) => {
              if (item.path === '/') {
                routeUtils(item.children, res.menuPermissions)
              }
            })
            store.commit('SET_ROUTES', staticRoutes) //存储菜单权限
            router.addRoutes(staticRoutes) // 动态添加可访问路由表
            next({ ...to, replace: true })
          })
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
