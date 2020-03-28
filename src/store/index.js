import Vue from 'vue'
import Vuex from 'vuex'
import { Toast, Notify } from 'vant'
import {router} from '../router/index'
import {routers} from '../router/router.js'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    newsData: null,
    refundData: null
  },
  mutations: {
    setNewsData (state, data) {
      state.newsData = data
    },
    setRefundData (state, data) {
      state.refundData = data
    },
    setHomeBoo (state, data) {
      state.homeBoo = data
    },
    setRouter (state, data) {
      let datas = []
      if (data) {
        datas = data
      } else {
        datas = JSON.parse(localStorage.getItem('routers') || '[]')
      }
      let arr = []
      datas.forEach(item => {
        arr.push({
          meta: item.meta,
          path: item.path,
          name: item.name,
          component: () => import('@/views' + item.component),
          children: item.children
        })
      })
      routers.push(...arr)
      router.addRoutes(routers)
    }
  },
  actions: {
    routerAdd (state, data) {
      state.commit('setRouter', data)
    },
    setNewsData (state, data) {
      Notify({
        type: 'primary',
        message: '通知内容',
        duration: 1000 * 5,
        onClick: () => {
          router.push('/orderForm')
        }
      })
      state.commit('setNewsData', data)
    },
    setRefundData (state, data) {
      Notify({
        type: 'warning',
        message: '通知内容',
        duration: 1000 * 5,
        onClick: () => {
          router.push('/orderForm')
        }
      })
      state.commit('setRefundData', data)
    },
    setHomeBoo (state, data) {
      Toast.fail('asd')
      console.log(router.push('home'))
    },
    loading (state, mv) {
      mv.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
    }
  }
})

export default store
