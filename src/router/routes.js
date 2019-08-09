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
        path: 'user',
        name: '用户管理',
        component: () => import('@/views/user/Index'),
      },
      {
        path: 'lawyer',
        name: '律师管理',
        component: () => import('@/views/lawyer/Index.vue'),
      },
      {
        path: 'product',
        name: '服务管理',
        component: () => import('@/views/product/Index.vue'),
      },
      {
        path: 'order',
        name: '订单管理',
        component: () => import('@/views/order/Index.vue'),
      },
      {
        path: 'pay',
        name: '提现管理',
        component: () => import('@/views/pay/Index.vue'),
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/TheLogin.vue'),
    hidden: true
  }
]