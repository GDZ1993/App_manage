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
