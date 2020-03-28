<template>
  <div>
    <van-panel :title="'订单类型：' + orderType[item.billType]" :status="(item.state == 'APPLYRETURN' && item.returnMark? '整单:' : item.state != 'APPLYRETURN' && item.returnMark ? '退菜:' : '')+stateType[item.state]" v-for="(item) in list" :key="item.id" style="margin-bottom: 0.5rem">
      <div class="panel-content">
        <van-cell title="订单号:" :value="item.billno" />
        <van-card  v-for="it in item[item.billType == 'TAKEOUT' ? 'takeoutBillDetailPicPath' : 'scanBillDetailPicPath']" :key="it.id + it.foodId" :num="it.buyCount" :price="it.discountPrice || it.fullMinusPrice" :origin-price="it.noramlPrice" :title="it.foodName" :thumb="$picture_src+it.relativePath">
          <div slot="tag" v-if="it.returnState && item.state != 'APPLYRETURN' && item.returnMark">
            <van-tag mark type="danger">退菜</van-tag>
          </div>
        </van-card>
        <van-cell title="商品金额:" :value="item.totalMoney" />
        <div v-if="item.billType == 'TAKEOUT'">
          <van-cell title="包装费:" :value="item.packingMoney" />
          <van-cell title="配送费:" :value="item.sendMoney" />
        </div>
        <van-cell title="整单优惠:" :value="item.sumMoney && item.minusMoney?'满' + item.sumMoney + '减' + item.minusMoney : item.allBillDiscount ? item.allBillDiscount : '无'" />
        <van-cell title="实付金额:" :value="item.shouldPay" />
      </div>
      <div slot="footer" class="row-end">
        <van-button size="small" type="info" :to="{name: 'orderDetails', params: item}">查看</van-button>
      </div>
    </van-panel>
    <Without v-if="!list.length"/>
  </div>
</template>

<script>
export default {
  props: {
    list: Array
  },
  name: 'orderEntity',
  data () {
    return {
      orderType: {
        TAKEOUT: '外卖',
        SCAN: '堂食'
      },
      stateType: {
        WAITPAY: '待支付',
        CANCELED: '已取消',
        RETURNED: '退单',
        FINISH: '已支付',
        WAITRETURN: '等待退款',
        APPLYRETURN: '申请退单中'
      }
    }
  }
}
</script>

<style scoped>

</style>
