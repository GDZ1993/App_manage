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
      <!--<button @click="click_test">click_test</button>-->
      <van-tabs v-model="active" animated swipeable sticky color="#1989fa" @change="dropdown_change" swipe-threshold="5">
        <van-tab :title="item" v-for="(item,index) in activeTypeText" :key="item">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" v-if="active==index">
            <OrderEntity :list="arr"/>
          </van-list>
        </van-tab>
        <!--<van-tab title="待支付">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" v-if="active==1">
            &lt;!&ndash;<van-panel :title=" + item.return_mark ? '桌号: ' + item.table_no + ' 退菜' : '桌号: ' + item.table_no + ' 正常'" :status="stateType[item.state]" v-for="item in list" :key="item.id" >
              <div class="panel-content">
                <van-cell title="订单号:" :value="item.billNo" />
                <van-cell title="小计金额:" :value="item.total_money" />
                <van-cell title="已优惠:" :value="item.discount_money || 0" />
                <van-cell title="实付金额:" :value="item.final_money" />
                <van-cell title="支付方式:" value="微信支付" v-if="item.state==='FINISH'"/>
                <van-cell title="下单时间:" :value="item.commit_time" />
                <van-cell title="备注:" :value="item.others" />
              </div>
              <div slot="footer" class="row-end" >
                <van-button size="small" type="info" :to="{name: 'orderDetails', params: item}">查看</van-button>
              </div>
            </van-panel>&ndash;&gt;
            <OrderEntity :list="list"/>
            <Without v-if="!list.length"></Without>
          </van-list>
        </van-tab>
        <van-tab title="已取消">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" v-if="active==2">
            &lt;!&ndash;<van-panel :title=" + item.return_mark ? '桌号: ' + item.table_no + ' 退菜' : '桌号: ' + item.table_no + ' 正常'" :status="stateType[item.state]" v-for="item in list" :key="item.id" >
              <div class="panel-content">
                <van-cell title="订单号:" :value="item.billNo" />
                <van-cell title="小计金额:" :value="item.total_money" />
                <van-cell title="已优惠:" :value="item.discount_money || 0" />
                <van-cell title="实付金额:" :value="item.final_money" />
                <van-cell title="支付方式:" value="微信支付" v-if="item.state==='FINISH'"/>
                <van-cell title="下单时间:" :value="item.commit_time" />
                <van-cell title="备注:" :value="item.others" />
              </div>
              <div slot="footer" class="row-end" >
                <van-button size="small" type="info" :to="{name: 'orderDetails', params: item}">查看</van-button>
              </div>
            </van-panel>&ndash;&gt;
            <OrderEntity :list="list"/>
            <Without v-if="!list.length"></Without>
          </van-list>
        </van-tab>
        <van-tab title="已完成">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" v-if="active==3">
            &lt;!&ndash;<van-panel :title=" + item.return_mark ? '桌号: ' + item.table_no + ' 退菜' : '桌号: ' + item.table_no + ' 正常'" :status="stateType[item.state]" v-for="item in list" :key="item.id" >
              <div class="panel-content">
                <van-cell title="订单号:" :value="item.billNo" />
                <van-cell title="小计金额:" :value="item.total_money" />
                <van-cell title="已优惠:" :value="item.discount_money || 0" />
                <van-cell title="实付金额:" :value="item.final_money" />
                <van-cell title="支付方式:" value="微信支付" v-if="item.state==='FINISH'"/>
                <van-cell title="下单时间:" :value="item.commit_time" />
                <van-cell title="备注:" :value="item.others" />
              </div>
              <div slot="footer" class="row-end">
                <van-button size="small" type="info" :to="{name: 'orderDetails', params: item}">查看</van-button>
              </div>
            </van-panel>&ndash;&gt;
            <OrderEntity :list="list"/>
            <Without v-if="!list.length"></Without>
          </van-list>
        </van-tab>
        <van-tab title="退单">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" v-if="active==4">
            &lt;!&ndash;<van-panel :title=" + item.return_mark ? '桌号: ' + item.table_no + ' 退菜' : '桌号: ' + item.table_no + ' 正常'" :status="stateType[item.state]" v-for="item in list" :key="item.id" >
              <div class="panel-content">
                <van-cell title="订单号:" :value="item.billNo" />
                <van-cell title="小计金额:" :value="item.total_money" />
                <van-cell title="已优惠:" :value="item.discount_money || 0" />
                <van-cell title="实付金额:" :value="item.final_money" />
                <van-cell title="支付方式:" value="微信支付" v-if="item.state==='FINISH'"/>
                <van-cell title="下单时间:" :value="item.commit_time" />
                <van-cell title="备注:" :value="item.others" />
              </div>
              <div slot="footer" class="row-end">
                <van-button size="small" type="info" :to="{name: 'orderDetails', params: item}">查看</van-button>
              </div>
            </van-panel>&ndash;&gt;
            <OrderEntity :list="list"/>
            <Without v-if="!list.length"></Without>
          </van-list>
        </van-tab>-->
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
    '$store.state.refundData' (x) {
      console.log('refundData', x)
      // let arr = this.list.filter(item => item.billNo === x.billno)
      // if (!arr || !arr.length) {
      //   this.list.unshift({
      //     billNo: x.billno,
      //     commit_time: this.$Time(x.commitTime).format('YYYY-MM-DD HH:mm:ss'),
      //     discount_money: x.discountMoney,
      //     final_money: x.finalMoney,
      //     others: x.others,
      //     return_mark: x.returnMark,
      //     should_pay: x.shouldPay,
      //     state: x.state,
      //     table_no: x.tableNo,
      //     total_money: x.totalMoney
      //   })
      // }
    }
  },
  methods: {
    click_test () {
      let str = '{"billDetail":{"id":356,"billno":"S_561812242388099d72","sellerOpenid":"oi1bm1StkEwagvQuHaW7d6Wd7RYI","buyerOpenidUserid":"oi1bm1aW42BE7p4SgBaxkxcd3coo","clientType":"WECHART","tableNo":"003","totalMoney":1,"discountMoney":0.99,"shouldPay":0.01,"finalMoney":0.01,"commitTime":1585552877000,"others":"","state":"WAITPAY","billType":"SCAN","scanBillDetailPicPath":[{"id":635,"billno":"S_561812242388099072","foodId":76,"foodName":"红烧鲤鱼","buyCount":1,"picUuid":"f0a7d479-dd3c-4fed-890d-3584c6ae5160","noramlPrice":1,"discountPrice":0.01,"fullMinusPrice":0.01,"relativePath":"f0a7d479-dd3c-4fed-890d-3584c6ae5160.png"}]},"resultCode":0}'
      console.log(JSON.parse(str))
      this.$store.dispatch('setNewsData', JSON.parse(str))
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
          // pageNum: this.page
        }).then(res => {
          if (res.data.resultCode === 0) {
            // this.pages = 1
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
  },
  beforeMount () {}
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
