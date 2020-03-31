<template>
    <div>
      <div style="position: fixed;width: 100%;top: 0;left: 0;z-index: 99;"><van-nav-bar title="餐饮管理系统" /></div>
      <div style="height: 2.875rem"></div>
      <van-cell :title="shopEntity.storeName" icon="shop-o" style="margin-bottom: 0.5rem" v-if="shopEntity.storeName"></van-cell>
      <van-cell title="订单管理" is-link to="orderForm" />
      <van-cell title="菜品管理" is-link to="classify" style="margin-bottom: 0.5rem"/>
      <van-cell title="打折特价" is-link to="discount" />
      <van-cell title="二维码" is-link @click="application_qrcode" :value="qrcode_state == 'APPROVED' ? qrcode_count : qrcodeType[qrcode_state]" style="margin-bottom: 0.5rem"/>
      <van-cell title="店铺设置" is-link to="setting" />
      <van-cell title="外卖状态" :to="take_state == 'UNAPPLY' || take_state == 'REFUSED' ? 'takeOut' : ''" :is-link="take_state == 'UNAPPLY' || take_state == 'REFUSED'" :value="takeOut[take_state] + refuse_reason"/>
      <!--<van-cell title="清除缓存" is-link @click="clearCache"/>-->
      <van-dialog v-model="dialog" title="申请二维码" show-cancel-button @confirm="dialog_ok" @cancel="dialog_cancel">
        <div style="width: 100%;padding: 1rem">
          <van-cell title="单元格" value="内容" size="large">
            <van-stepper v-model="dialog_tepper_count" integer slots="default"/>
          </van-cell>
        </div>
      </van-dialog>
      <van-popup v-model="popup_show" position="right" style="width: 100%; height: 100%;" >
        <div style="width: 100%;height: 100%;overflow: auto">
          <div style="width: 100%;height: 2.875rem;position: fixed;top: 0;left: 0;z-index: 10">
            <van-nav-bar title="二维码" left-text="返回" @click-left="popup_show=false" />
          </div>
          <div style="height: 2.875rem;"></div>
          <div class="row-between" style="padding: 1rem; flex-wrap: wrap">
            <van-image class="vanImage"  :src="item.codeurl" v-for="(item,index) in qrcode_codeList" :key="index"/>
            <van-button type="info" size="small" v-clipboard:copy="$picture_src + qrcode_Leavestat" v-clipboard:success="onCopy" v-clipboard:error="onError">复制解压包地址</van-button>
            <div class="row-end" v-if="qrcode_codeList[0]" style="width: 300px;word-break: break-all">{{$picture_src + qrcode_Leavestat}}</div>
          </div>
        </div>
      </van-popup>
    </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      popup_show: false,
      dialog: false,
      dialog_tepper_count: 1,
      shopEntity: {
        storeName: '',
        relativepath: ''
      },
      take_state: '',
      refuse_reason: '',
      qrcode_state: '',
      qrcode_codeList: [],
      qrcode_count: null,
      qrcode_Leavestat: '',
      qrcodeType: {
        UNAPPLY: '未申请',
        APPLYING: '审核中',
        REFUSED: '拒绝申请',
        APPROVED: '通过申请'
      },
      takeOut: {
        UNAPPLY: '未申请',
        APPLYING: '审核中',
        REFUSED: '拒绝申请',
        APPROVED: '通过'
      }
    }
  },
  methods: {
    onError () {
      this.$toast.fail('复制失败')
    },
    onCopy () {
      this.$toast.success('复制成功')
    },
    dialog_ok () {
      this.application_qrcodeRequest()
    },
    dialog_cancel () {
      this.dialog_tepper_count = 1
    },
    clearCache () {
      this.$cookie.remove('openid')
      localStorage.setItem('routers', '')
      this.$router.push('/login')
    },
    application_qrcode () {
      console.log(this.qrcode_state)
      if (this.qrcode_state === 'APPROVED') {
        this.popup_show = true
      } else if (this.qrcode_state !== 'APPLYING') this.dialog = true
    },
    application_qrcodeRequest () {
      return new Promise((resolve, reject) => {
        this.$ajax.post('/addfile', {
          mchid: this.$cookie.get('openid'),
          count: this.dialog_tepper_count,
          qrclass: 'order'
        }).then(res => {
          if (res.data.resultCode === 0) {
            resolve(res)
          } else reject(res)
        }).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    },
    shopRequest () {
      return new Promise((resolve, reject) => {
        this.$ajax.post('/SellerInfo/Select', {
          openid: this.$cookie.get('openid')
        }).then(res => {
          if (res.data.resultCode === 0) {
            this.shopEntity = res.data.sellerInfo
            resolve(res)
          } else reject(res)
        }).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    },
    qrCodeRequest () {
      return new Promise((resolve, reject) => {
        this.$ajax.post(this.$URL2 + '/Merchant_status', {
          mchid: this.$cookie.get('openid')
        }).then(res => {
          if (res.data.resultCode === 0) {
            this.qrcode_state = res.data.state
            this.qrcode_count = res.data.codeurlList.length
            this.qrcode_codeList = res.data.codeurlList
            this.qrcode_Leavestat = res.data.Leavestat
            resolve(res)
          } else reject(res)
        }).catch(e => {
          console.log(e)
          reject(e)
        })
      })
    }
  },
  beforeMount () {
    this.take_state = this.$cookie.getJSON('take-out').state
    this.$store.dispatch('loading', this)
    this.$axios.all([this.qrCodeRequest(), this.shopRequest()]).then(res => this.$toast.clear()).catch(e => this.$toast.clear())
  }
}
</script>

<style scoped>
  .vanImage {
    width: 10rem;
    height: 10rem;
    margin-bottom: 0.5rem;
  }
</style>
