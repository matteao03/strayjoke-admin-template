import Vue from 'vue'
import Router from 'vue-router'
import { staticRoutes, whiteListRoutes } from './routes'
import routeUtils from '@/utils/routeUtils'
import { hasPermission } from '@/utils/common'
import permissions from '@/permissions'

Vue.use(Router)
const router = new Router({
  mode: 'history',
  base: '/vue/',
  routes: staticRoutes
})

// const copyStaticRoutes = deepCopy(staticRoutes)

// 前置导航守卫
router.beforeEach((to, from, next) => {
  const app = router.app
  const store = app.$options.store
  const auth = store.state.auth

  if (auth.token) {
    if (to.path === '/login') {
      next(from.path)
    } else {
      if (permissions.state.roles.length === 0) { // 判断是否拉取完用户角色信息
        store.dispatch('getUserInfo').then(res => {
          store.dispatch('getPermissions').then(res => {
            staticRoutes.forEach((item) => {
              if (item.path === '/') {
                routeUtils(item.children, res.menuPermissions)
              }
            })
            permissions.SET_ROUTES({ ...res, 'routes': staticRoutes })
            router.addRoutes(staticRoutes) // 动态添加可访问路由表
            next({ ...to, replace: true })
          })
        })
      } else {
        if (hasPermission(permissions.state.pagePermissions, to.path) || hasPermission(whiteListRoutes, to.path)) {
          next()
        } else {
          next('/401')
        }
      }
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      // const whiteList = permissions.state.whiteList // 白名单
      // if (!whiteList) {
      //   store.dispatch('getWhiteList').then(res => {
      //     const whiteList = res.pagePermissions
      //     if (whiteList && whiteList.length > 0 && hasPermission(whiteList, to.path)) {
      //       routeUtils(staticRoutes, res.menuPermissions)
      //       permissions.SET_WHITE_LIST({ ...res, 'routes': staticRoutes })

      //       router.addRoutes(staticRoutes) // 动态添加可访问路由表
      //       next({ ...to, replace: true })
      //     } else {
      //       next(`/login`)
      //     }
      //   })
      // } else if (whiteList.length > 0 && hasPermission(whiteList, to.path)) {
      //   next()
      // } else {
      next(`/login`)
      // }
    }
  }
})

export default router
