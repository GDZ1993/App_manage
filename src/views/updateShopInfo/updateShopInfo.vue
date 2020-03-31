<template>
    <div class="updateShopInfo-div">
      <div style="position: fixed;width: 100%;top: 0;left: 0;z-index: 99;">
        <van-nav-bar title="设置店铺信息" left-text="返回" @click-left="$router.go(-1)" />
      </div>
      <div style="height: 2.875rem"></div>
      <van-form @submit="onSubmit">
        <van-field v-model="formData.shopName" label="店铺名称" name="shopName" :rules="formRules['shopName']" placeholder="请填写店铺名称" />
        <van-field v-model="formData.storePhoneNum" type="tel" label="店铺电话" name="storePhoneNum" :rules="formRules['storePhoneNum']" placeholder="请填写店铺联系方式" class="field-css"/>
        <van-field name="scanOpenTime" label="营业时间" :value="formData.scanOpenTime"  :rules="formRules['scanOpenTime']" @click="begin_showPicker = true" placeholder="未设置" readonly clickable right-icon="arrow" />
        <van-field name="scanCloseTime" label="停业时间" :value="formData.scanCloseTime" :rules="formRules['scanCloseTime']" @click="end_showPicker = true"  placeholder="未设置" readonly clickable right-icon="arrow"  class="field-css"/>
        <div>
          <van-field :value="formData.takeoutOpentime" label="外卖营业时间"  name="takeoutOpentime" :rules="formRules['takeoutOpentime']" @click="tkopen_showPicker = true" placeholder="未设置" readonly clickable right-icon="arrow" />
          <van-field :value="formData.takeoutCloseTime" label="外卖停业时间" name="takeoutCloseTime" :rules="formRules['takeoutCloseTime']" @click="tkEnd_showPicker = true"  placeholder="未设置" readonly clickable right-icon="arrow"  class="field-css"/>
          <van-field v-model="formData.startMoney" label="起送价格" name="startMoney" :rules="formRules['startMoney']" placeholder="请填写起送价格" />
          <van-field v-model="formData.sendMoney" label="配送费" name="sendMoney" :rules="formRules['sendMoney']" placeholder="请填写配送费" class="field-css"/>
          <van-field v-model="formData.stepMoney" label="超出范围续费" name="stepMoney" :rules="formRules['stepMoney']" placeholder="超过三公里每增加一公里的费用" />
          <van-field v-model="formData.makeTime" type="digit" label="出餐时间" name="makeTime" :rules="formRules['makeTime']" placeholder="请填写出餐时间" class="field-css"/>
        </div>
        <van-field name="switch" label="外卖营业状态">
          <template #input>
            <van-switch v-model="formData.beginRecv" size="20" />
          </template>
        </van-field>
        <van-field name="switch" label="外卖自动接单" class="field-css">
          <template #input>
            <van-switch v-model="formData.autoRecvOrder" size="20" />
          </template>
        </van-field>
        <van-field v-model="formData.announcement" rows="2" name="others" :autosize="{maxHeight: 100}" label="公告" type="textarea" placeholder="请填写公告" maxlength="160" show-word-limit/>
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
      <van-popup v-model="begin_showPicker" position="bottom">
        <van-datetime-picker type="time" @cancel="begin_showPicker = false" :formatter="formatter" @confirm="onbegin_Confirm" />
      </van-popup>
      <van-popup v-model="end_showPicker" position="bottom">
        <van-datetime-picker type="time" @cancel="end_showPicker = false" :formatter="formatter" @confirm="onend_Confirm" />
      </van-popup>
      <van-popup v-model="tkopen_showPicker" position="bottom">
        <van-datetime-picker type="time" @cancel="tkopen_showPicker = false" :formatter="formatter" @confirm="tkopen_Confirm" />
      </van-popup>
      <van-popup v-model="tkEnd_showPicker" position="bottom">
        <van-datetime-picker type="time" @cancel="tkEnd_showPicker = false" :formatter="formatter" @confirm="tkEnd_Confirm" />
      </van-popup>
    </div>
</template>

<script>
export default {
  name: 'updateShopInfo',
  data () {
    return {
      uploader: [],
      begin_showPicker: false,
      end_showPicker: false,
      tkopen_showPicker: false,
      tkEnd_showPicker: false,
      formData: {
        openid: this.$cookie.get('openid'), // 商户微信唯一标识
        shopName: '', // 店铺名称
        startMoney: '', // 起送价格
        sendMoney: '', // 配送费（三公里以下）
        stepMoney: '', // 超过三公里每增加一公里的费用
        makeTime: null, // 出餐时间，整数，分钟为单位
        beginRecv: false, // 外卖开始接单标志
        takeoutOpentime: '', // 外卖开门时间
        takeoutCloseTime: '', // 外卖打烊时间
        scanOpenTime: '', // 扫码点餐开始营业时间
        scanCloseTime: '', // 扫码点餐打烊时间
        announcement: '', // 公告
        autoRecvOrder: false, // 外卖自动接单开关
        storePhoneNum: '' // 商铺联系电话
      },
      formRules: {
        shopName: [{ required: true, message: '请填写店铺名称' }],
        storePhoneNum: [{ required: true, message: '请填写商铺联系电话' }],
        startMoney: [{ required: true, message: '请填写起送价格' }],
        sendMoney: [{ required: true, message: '请填写配送费' }],
        stepMoney: [{ required: true, message: '请填写超过三公里每增加一公里的费用' }],
        makeTime: [{ required: true, message: '请填写出餐时间' }],
        scanOpenTime: [{ required: true, message: '请设置店铺营业时间' }],
        scanCloseTime: [{ required: true, message: '请设置店铺营业时间' }],
        takeoutOpentime: [{ required: true, message: '请设置外卖营业时间' }],
        takeoutCloseTime: [{ required: true, message: '请设置外卖营业时间' }]
      }
    }
  },
  methods: {
    onend_Confirm (e) {
      this.formData.scanCloseTime = e
      this.end_showPicker = false
    },
    onbegin_Confirm (e) {
      this.formData.scanOpenTime = e
      this.begin_showPicker = false
    },
    tkopen_Confirm (e) {
      this.formData.takeoutOpentime = e
      this.tkopen_showPicker = false
    },
    tkEnd_Confirm (e) {
      this.formData.takeoutCloseTime = e
      this.tkEnd_showPicker = false
    },
    formatter (type, val) {
      let date = {
        year: '年',
        month: '月',
        day: '日',
        hour: '时',
        minute: '分'
      }
      return `${val}${date[type]}`
    },
    beforeRead (file) {
      let arr = ['jpeg', 'jpg', 'png', 'gif'].filter(item => file.type.indexOf(item) !== -1 ? item : '')
      console.log('beforeRead', arr, file)
      if (!arr.length) {
        this.$toast.fail('请上传 jpeg,jpg,png,gif 格式图片')
        return false
      }
      return true
    },
    asyncBeforeRead (file) {
      return new Promise((resolve, reject) => {
        console.log('asyncBeforeRead', file)
        let arr = ['jpeg', 'jpg', 'png', 'gif'].filter(item => file.file.type.indexOf(item) !== -1 ? item : '')
        console.log('asyncBeforeRead', arr, file)
        if (!arr.length) {
          this.$toast.fail('请上传 jpeg,jpg,png,gif 格式图片')
          reject(file)
        } else {
          this.uploader_img(file.file)
          resolve()
        }
      })
    },
    uploader_img (e) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      let formdata = new FormData()
      formdata.append('file', e)
      return new Promise((resolve, reject) => {
        this.$ajax.post(this.$URL + '/orderFood/picUpload/upload', formdata).then(res => {
          if (res.data.resultCode === 0) {
            this.$toast.success({
              message: '图片上传成功',
              forbidClick: true,
              duration: 1000
            })
            this.formData.logo_uuid = res.data.pic_uuid
            resolve(res)
          } else {
            this.$toast.fail('图片上传失败')
            reject(res)
          }
        }).catch(e => {
          this.$toast.fail('请求图片上传接口失败')
          console.log(e)
          reject(e)
        })
      })
    },
    onSubmit () {
      let e = JSON.parse(JSON.stringify(this.formData))
      e.openid = this.$cookie.get('openid')
      this.update_Request(e)
    },
    update_Request (e) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/takeout_registration', e).then(res => {
          if (res.data.resultCode === 0) {
            this.$toast.success({
              message: '操作成功',
              forbidClick: true,
              onClose: () => this.$router.go(-1)
            })
            resolve(res)
          } else {
            this.$toast.fail(res.data.errorMsg)
            reject(res)
          }
        }).catch(e => {
          this.$toast.fail('请求失败')
          console.log(e)
          reject(e)
        })
      })
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
            let e = res.data.applymentList
            let autoRecvOrder = false
            let beginRecv = false
            if (e.beginRecv) beginRecv = true
            if (e.autoRecvOrder) autoRecvOrder = true
            this.formData = {
              openid: this.$cookie.get('openid'), // 商户微信唯一标识
              shopName: e.shopName, // 店铺名称
              startMoney: e.startMoney, // 起送价格
              sendMoney: e.sendMoney, // 配送费（三公里以下）
              stepMoney: e.stepMoney, // 超过三公里每增加一公里的费用
              makeTime: e.makeTime, // 出餐时间，整数，分钟为单位
              beginRecv: beginRecv, // 外卖开始接单标志
              takeoutOpentime: e.takeoutOpentime, // 外卖开门时间
              takeoutCloseTime: e.takeoutCloseTime, // 外卖打烊时间
              scanOpenTime: e.scanOpenTime, // 扫码点餐开始营业时间
              scanCloseTime: e.scanCloseTime, // 扫码点餐打烊时间
              announcement: e.announcement, // 公告
              autoRecvOrder: autoRecvOrder, // 外卖自动接单开关
              storePhoneNum: e.storePhoneNum // 商铺联系电话
            }
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
    }
  },
  mounted () {
    this.request()
  }
}
</script>
<style>
  .updateShopInfo-div .van-field__control{
    text-align: right;
    justify-content: flex-end;
  }
</style>
<style scoped>
  .field-css{
    margin-bottom: 0.5rem;
  }
</style>
