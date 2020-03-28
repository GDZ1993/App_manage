// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = []
export const routers = [
  ...appRouter,
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/login/login.vue'),
    children: []
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login.vue'),
    children: []
  }
]
