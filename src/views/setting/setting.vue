<template>
    <div>
      <div style="position: fixed;width: 100%;top: 0;left: 0;z-index: 99;">
        <van-nav-bar title="店铺信息" left-text="返回" @click-left="$router.push('/home')" />
      </div>
      <div style="height: 2.875rem"></div>
      <van-cell :title="shopEntity.shopName" icon="shop-o"></van-cell>
      <van-cell title="店铺电话" :value="shopEntity.storePhoneNum" class="field-css"/>
      <van-cell title="营业时间" :value="shopEntity.scanOpenTime + '-' + shopEntity.scanCloseTime"/>
      <div v-if="shopEntity.state=== 'APPROVED'">
        <van-cell title="外卖营业时间" :value="shopEntity.takeoutOpentime + '-' + shopEntity.takeoutCloseTime" class="field-css"/>
        <van-cell title="出餐时间" :value="shopEntity.makeTime"/>
        <van-cell title="起送价格" :value="shopEntity.startMoney" class="field-css"/>
        <van-cell title="配送费" :value="shopEntity.sendMoney"/>
        <van-cell title="超出范围" :value="shopEntity.stepMoney" class="field-css"/>
        <van-cell title="外卖营业状态" >
          <div slot="default" class="row-end">
            <p style="margin-right: 1rem">{{shopEntity.beginRecv ? '正常营业' : '暂时停业'}}</p>
            <van-switch v-model="shopEntity.beginRecv" size="20" />
          </div>
        </van-cell>
        <van-cell title="店铺地址" :value="address" class="field-css"/>
      </div>
      <van-cell title="整单折扣" is-link to="/orderDiscount"/>
      <van-cell title="整单满减" is-link style="margin-bottom: 0.5rem" to="/moneyOff"/>
      <van-cell title="设置" is-link to="/updateShopInfo"/>
      <p class="row-div" style="margin-top: 2rem;color: red;font-size: 0.75rem" @click="log_out">退出系统</p>
      <div style="height: 1rem;"></div>
    </div>
</template>

<script>
export default {
  name: 'setting',
  data () {
    return {
      address: '',
      openState_loading: false,
      shopEntity: {
        shopName: '', // 店铺名称
        longitude: '', // 经度
        latitude: '', // 纬度
        province: '', // 店铺地址：省
        city: '', // 店铺地址：市
        area: '', // 店铺地址：区县
        street: '', // 店铺地址：街道门牌
        startMoney: '', // 起送价格
        sendMoney: '', // 配送费（三公里以下）
        stepMoney: '', // 超过三公里每增加一公里的费用
        makeTime: '', // 出餐时间，整数，分钟为单位
        beginRecv: false, // 外卖开始接单标志
        takeoutOpentime: '', // 外卖开门时间
        takeoutCloseTime: '', // 外卖打烊时间
        scanOpenTime: '', // 扫码点餐开始营业时间
        scanCloseTime: '', // 扫码点餐打烊时间
        announcement: '', // 公告
        autoRecvOrder: false, // 外卖自动接单开关
        storePhoneNum: '' // 商铺联系电话
      }
    }
  },
  methods: {
    log_out () {
      this.$cookie.remove('openid')
      localStorage.setItem('routers', '')
      this.$router.push('/')
    },
    request () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/SellerInfo/Select', {
          opeind: this.$cookie.get('openid')
        }).then(res => {
          if (res.data.resultCode === 0) {
            let d = res.data.applymentList
            this.shopEntity = d
            let province = d.province || ''
            let city = d.city || ''
            let area = d.area || ''
            let street = d.street || ''
            this.address = province + '-' + city + '-' + area + '-' + street
            this.$toast.clear()
            resolve(res)
          } else {
            this.$toast.fail(res.data.errorMsg)
            reject(res)
          }
        }).catch(e => {
          this.$toast.clear()
          console.log(e)
          reject(e)
        })
      })
    },
    onInput () {
      this.$dialog.confirm({
        title: '提示',
        message: '是否切换营业状态？'
      }).then(() => this.switchReuqst())
    },
    switchReuqst () {
      this.openState_loading = true
      return new Promise((resolve, reject) => {
        this.$ajax.post('/SellerInfo/business', {
          open_state: this.shopEntity.openState ? 1 : 0,
          openid: this.$cookie.get('openid')
        }).then(res => {
          if (res.data.resultCode === 0) {
            this.$toast.success({
              message: '修改成功.',
              forbidClick: true
            })
            resolve(res)
          } else reject(res)
          this.openState_loading = false
        }).catch(e => {
          this.openState_loading = false
          console.log(e)
          reject(e)
        })
      })
    }
  },
  mounted () {
    this.request()
  }
}
</script>

<style scoped>
  .title-img{
    width: 100%;
    height: 9rem;
  }
  .field-css{
    margin-bottom: 0.5rem;
  }
</style>
