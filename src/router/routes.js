import TheLayout from '@/views/layout/TheLayout'
import Dashboard from '@/views/Dashboard'

export const staticRoutes = [
  {
    path: '',
    redirect: '/dashboard',
    hidden: true
  },
  {
    path: '/',
    component: TheLayout,
    children: [
      {
        path: 'dashboard',
        name: '工作台',
        component: Dashboard
      },
      {
        path: '401',
        name: '401',
        component: () => import('@/views/error/401'),
        hidden: true
      },
      {
        path: 'system/user/profile',
        name: '个人主页',
        component: () => import('@/views/system/user/Profile'),
        hidden: true
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/TheLogin'),
    hidden: true
  }
]

export const whiteListRoutes = [
  '/dashboard',
  '/401',
  '/system/user/profile'
]
