import Vue from 'vue'
import Router from 'vue-router'
import {routers} from './router.js'
import cookie from 'js-cookie'
Vue.use(Router)

const RouterConfig = {
  // mode: 'history',
  routes: routers
}
export const router = new Router(RouterConfig)
router.beforeEach((to, from, next) => {
  if (to.name === 'signIn') {
    next()
  } else if (to.name === 'login' && cookie.get('openid') && localStorage.getItem('routers')) {
    console.log(1)
    next('/home')
  } else if (to.name !== 'login' && !(cookie.get('openid') || localStorage.getItem('routers'))) {
    console.log(2)
    next('/login')
  } else next()
})
