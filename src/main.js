// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {router} from './router/index'
import store from './store/index'
import Vant from 'vant'
import 'vant/lib/index.css'
import './App.css'
import util from '../static/util'
import moment from 'moment'
import axios from 'axios'
import cookie from 'js-cookie'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
Vue.use(Vant)
Vue.config.productionTip = false
Vue.prototype.$picture_src = 'https://www.ddqcwl.com/qc_pay/pics/'
Vue.prototype.$URL = 'https://www.ddqcwl.com:8888'
Vue.prototype.$URL2 = 'https://www.ddqcwl.com:8081'
Vue.prototype.$ajax = util.ajax
Vue.prototype.$axios = axios
Vue.prototype.$Random = util.Random
Vue.prototype.$Time = moment
Vue.prototype.$cookie = cookie
Vue.component('Without', () => import('@/components/without/without.vue'))
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router: router,
  components: { App },
  template: '<App/>',
  beforeMount () {
    this.$store.dispatch('routerAdd', null)
  }
})
