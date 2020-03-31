<template>
    <div>
      <div style="position: fixed;width: 100%;top: 0;left: 0;z-index: 99;">
        <van-nav-bar title="订单" left-text="返回" @click-left="$router.push('/home')" >
          <div slot="right">
            <van-dropdown-menu>
              <van-dropdown-item v-model="orderType" :options="orderTypeArr" @change="dropdown_change"/>
            </van-dropdown-menu>
          </div>
        </van-nav-bar>
      </div>
      <div style="height: 2.875rem"></div>
      <van-tabs v-model="active" animated swipeable sticky color="#1989fa" @change="dropdown_change" swipe-threshold="5">
        <van-tab :title="item" v-for="(item,index) in activeTypeText" :key="item">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" v-if="active==index">
            <OrderEntity :list="arr"/>
          </van-list>
        </van-tab>
      </van-tabs>
    </div>
</template>

<script>
import OrderEntity from '../../components/orderEntity/orderEntity'
export default {
  name: 'orderForm',
  components: {
    OrderEntity
  },
  data () {
    return {
      orderType: 'SCAN',
      orderTypeArr: [
        { text: '订单类型：堂食', value: 'SCAN' },
        { text: '订单类型：外卖', value: 'TAKEOUT' }
      ],
      infoBoo: true,
      loading: false,
      finished: false,
      active: 0,
      activeType: ['ALL', 'WAITPAY', 'CANCELED', 'FINISH', 'RETURNED'], // WAITPAY:待支付,CANCELED:已取消,FINISH:已完成支付, RETURNED 退单
      activeTypeText: ['全部', '待支付', '已取消', '已完成', '退单'],
      list: [],
      arr: [],
      arrList: [],
      page: 0,
      pages: 1
    }
  },
  watch: {
    '$store.state.newsData' (res) {
      this.storeChange(res)
    },
    '$store.state.refundData' (res) {
      this.storeChange(res)
    }
  },
  methods: {
    storeChange (res) {
      if (res.resultCode === 0) {
        let activeType = -1
        this.activeType.forEach((item, index) => {
          if (item === res.billDetail.state) activeType = index
        })
        if (activeType !== this.active && this.active) return
        let inx = -1
        this.arrList.forEach((item, index) => {
          if (item.billno === res.billDetail.billno) inx = index
        })
        if (inx !== -1) {
          this.arrList.splice(inx, 1)
          this.arrList.unshift(res.billDetail)
          this.list = this.pageFunction(this.arrList, 10)
          let arr = []
          for (let i = 0; i < this.page + 1; i++) this.arr = arr.concat(this.list[i])
        } else {
          this.arrList.unshift(res.billDetail)
          this.arr.unshift(res.billDetail)
        }
      }
    },
    dropdown_change () {
      this.list = []
      this.arr = []
      this.page = 0
      this.loading = true
      this.finished = false
      this.request()
    },
    onLoad () {
      this.loading = true
      if (this.infoBoo) {
        this.request()
      } else if (!this.infoBoo && this.list.length && this.page + 1 < this.list.length) {
        this.page += 1
        this.arr = this.arr.concat(this.list[this.page])
        console.log('page', this.page, 'arr', this.arr)
        this.loading = false
      } else {
        this.finished = true
      }
    },
    request () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post(this.$URL + '/orderFood/takeoutBillOpt/historyBillList', {
          openid: this.$cookie.get('openid'),
          state: this.activeType[this.active] || '',
          type: this.orderType
        }).then(res => {
          if (res.data.resultCode === 0) {
            this.arrList = res.data.billList
            this.list = this.pageFunction(res.data.billList, 10)
            if (this.list.length) {
              this.arr = this.list[this.page]
              this.infoBoo = false
              this.loading = false
            } else {
              this.infoBoo = false
              this.loading = false
              this.finished = true
            }
            this.$toast.clear()
            resolve(res)
          } else {
            this.$toast.fail(res.data.errorMsg)
            this.finished = true
            reject(res)
          }
        }).catch(e => {
          this.finished = true
          this.$toast.clear()
          console.log(e)
          reject(e)
        })
      })
    },
    pageFunction (arr, pageSize) {
      let oldArr = arr
      let newArr = []
      let tmpArr = []
      const countByPage = pageSize
      oldArr.forEach((item, index) => {
        tmpArr.push(item)
        if (index % countByPage === countByPage - 1 || index === oldArr.length - 1) {
          newArr.push(tmpArr)
          tmpArr = []
        }
      })
      return newArr
    }
  }
}
</script>

<style scoped>
  .content-div{
    width: 100%;
  }
  .panel-content{
    padding: 1rem 0;
  }
  .van-panel{
    margin-bottom: 0.5rem;
  }
</style>
