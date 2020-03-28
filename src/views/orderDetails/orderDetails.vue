<template>
    <div>
      <div style="position: fixed;width: 100%;top: 0;left: 0;z-index: 99;">
        <van-nav-bar title="订单详情" left-text="返回" @click-left="$router.go(-1)" />
      </div>
      <div style="height: 2.875rem"></div>
      <van-panel :title="'订单类型：' + orderType[entity.billType]" :status="stateType[entity.state]" v-if="entity">
        <div class="panel-content">
          <van-cell title="订单号:" :value="entity.billno" />
          <van-cell title="下单时间:" :value="entity.commitTime" />
          <van-swipe-cell v-for="(item,index) in entity[entity.billType == 'TAKEOUT' ? 'takeoutBillDetailPicPath' : 'scanBillDetailPicPath']" :key="item.foodId * item.id + item.billno" style="margin: 0.5rem 0">
            <van-card :num="item.buyCount" :price="item.noramlPrice" :title="item.foodName" :thumb="$picture_src+item.relativePath">
              <!--<div slot="tags" style="margin-top: 0.5rem">-->
                <!--<van-tag plain :type=" !item.returnState ? 'success' : 'danger'">{{!item.returnState ? '正常' : goodsType[item.returnState]}}</van-tag>-->
              <!--</div>-->
              <div slot="footer" v-if="entity.returnState">
                <van-button size="mini" type="primary" @click="agree_click">同意</van-button>
                <van-button size="mini" type="warning">拒绝</van-button>
              </div>
            </van-card>
            <van-button slot="right" square text="退菜" type="warning" class="delete-button" @click="delete_click(item,index)" v-if="!item.returnState  && entity.billType == 'SCAN'"/>
          </van-swipe-cell>
          <van-cell title="商品金额:" :value="entity.totalMoney" />
          <div v-if="entity.billType == 'TAKEOUT'">
            <van-cell title="包装费:" :value="entity.packingMoney" />
            <van-cell title="配送费:" :value="entity.sendMoney" />
          </div>
          <van-cell title="整单优惠:" :value="entity.sumMoney && entity.minusMoney?'满' + entity.sumMoney + '减' + entity.minusMoney : entity.allBillDiscount ? entity.allBillDiscount : '无'" />
          <van-cell title="实付金额:" :value="entity.shouldPay" />
          <van-cell title="支付方式:" :value="entity.client_type ? payType[entity.client_type] : '微信支付'" v-if="entity.state==='FINISH'"/>
          <van-cell title="备注:" :value="entity.others" />
          <div v-if="entity.billType == 'TAKEOUT'">
            <van-cell title="收件人:" :value="entity.takeoutBuyerAddrHistory.recvName" />
            <van-cell title="收件人电话:" :value="entity.takeoutBuyerAddrHistory.phoneNum" />
            <van-cell title="配送地址:" :value="entity.takeoutBuyerAddrHistory.province + '-' + entity.takeoutBuyerAddrHistory.city + '-' + entity.takeoutBuyerAddrHistory.area + entity.takeoutBuyerAddrHistory.street" />
          </div>
          <van-button type="danger" block v-if="entity.state != 'RETURNED' && entity.state != 'CANCELED'" @click="delete_click(0)">退单整单</van-button>
        </div>
        <!--<div slot="footer" class="row-end">
          <van-button size="small" type="warning" style="margin-left: 1rem" >同意退单</van-button>
          <van-button size="small" type="warning" style="margin-left: 1rem">删除订单</van-button>
        </div>-->
      </van-panel>
      <van-popup v-model="show" position="bottom" closeable @close="popup_close">
        <div style="padding: 1rem;" class="row-div">退菜信息</div>
        <van-card :num="item_entity.buyCount" :price="item_entity.noramlPrice" :title="item_entity.foodName" :thumb="$picture_src+item_entity.relativePath" style="margin-bottom: 2rem"/>
        <van-form @submit="onSubmit">
          <van-field v-model="returnedGoodsNumber" type="digit" name="returnedGoodsNumber" label="数量" placeholder="请填写退菜数量" :rules="[{ required: true, message: '退菜数量不能大于购买数量' }]" />
          <div style="margin: 2rem 1rem;"><van-button round block type="info" native-type="submit">提交</van-button></div>
        </van-form>
      </van-popup>
    </div>
</template>

<script>
export default {
  name: 'orderDetails',
  data () {
    return {
      show: false,
      returnedGoodsNumber: null,
      goodsType: {
        COMMIT: '提交待审批',
        REFUSE: '拒绝',
        WAIT: '已同意，等待退款状态',
        RETURNED: '已经退款完成状态'
      },
      item_entity: {
        buyCount: 0,
        noramlPrice: 0,
        foodName: '',
        relativePath: ''
      },
      entity: null,
      payType: {
        WECHART: '微信',
        ALIPAY: '支付宝'
      },
      stateType: {
        WAITPAY: '待支付',
        CANCELED: '已取消',
        RETURNED: '退单',
        FINISH: '已支付'
      },
      orderType: {
        TAKEOUT: '外卖',
        SCAN: '堂食'
      }
    }
  },
  methods: {
    onSubmit () {
      console.log(this.item_entity)
    },
    popup_close () {
      this.item_entity = {
        buyCount: 0,
        noramlPrice: 0,
        foodName: '',
        relativePath: ''
      }
      this.returnedGoodsNumber = null
      this.show = false
    },
    // 退单按钮
    delete_click (type, goods, num) {
      let entity = {
        billNo: this.entity.billno,
        foodId: '',
        count: '',
        billType: ''
      }
      if (type === 0 && this.entity.billType === 'TAKEOUT') {
        let {province, city, area, street, recvName, phoneNum, billType} = this.entity.takeoutBuyerAddrHistory
        let str = '客户名称:' + recvName + '\n联系电话:' + phoneNum + '\n配送地址:' + province + '-' + city + '-' + area + '-' + street
        this.$dialog.confirm({
          title: '外卖退单提示',
          message: str + '\n请确认与客户联系并说明原因...'
        }).then(() => {
          entity.billType = billType
          this.retreatFrom(entity)
        })
      } else if (type === 0 && this.entity.billType === 'SCAN') {
        this.$dialog.confirm({
          title: '堂食退单提示',
          message: '请确认与客户联系并说明原因...'
        }).then(() => {
          entity.billType = 'SCAN_ALL'
          this.retreatFrom(entity)
        })
      }
    },
    retreatFrom (e) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post(this.$URL + '/orderFood/billOpt/SellerReturn', e).then(res => {
          if (res.data.resultCode === 0) {
            this.$toast.fail('退单成功')
            this.entity.state = 'RETURNED'
            resolve(res.data.resultCode)
          } else {
            this.$toast.fail(res.data.errorMsg)
            reject(res)
          }
        }).catch(e => {
          this.$toast.fail('接口失败')
          console.log(e)
          reject(e)
        })
      })
    }
  },
  beforeMount () {
    if (this.$route.params && this.$route.params.billno) {
      this.billNo = this.$route.params.billno
      this.entity = this.$route.params
      console.log('订单详情对象', this.entity)
    } else {
      this.$toast.fail({
        message: '请选择查看内容',
        forbidClick: true,
        onClose: () => {
          this.$router.go(-1)
        }
      })
    }
  }
}
</script>

<style scoped>
  .delete-button{
    height: 100%;
  }
</style>
