<template>
    <div class="takeOut-div">
      <div style="position: fixed;width: 100%;top: 0;left: 0;z-index: 99;">
        <van-nav-bar title="外卖申请" left-text="返回" @click-left="$router.go(-1)" />
      </div>
      <div style="height: 44px"></div>
      <van-form @submit="onSubmit">
        <van-field name="logo_uuid" label="店铺logo" class="field-css" :rules="[{ required: true, message: '请上传店铺logo' }]">
          <template #input>
            <van-uploader v-model="logo_uuid" :max-count="1" :after-read="asyncBeforeReadC" :before-read="beforeRead"/>
          </template>
        </van-field>
        <van-field name="foodHygieneLicense" label="卫生许可证" class="field-css" :rules="[{ required: true, message: '请上传食品卫生许可证' }]">
          <template #input>
            <van-uploader v-model="foodHygieneLicense" :max-count="1" :after-read="asyncBeforeReadA" :before-read="beforeRead"/>
          </template>
        </van-field>
        <van-field name="foodBusinessLicense" label="经营许可证" class="field-css" :rules="[{ required: true, message: '请上传食品经营许可证' }]">
          <template #input>
            <van-uploader v-model="foodBusinessLicense" :max-count="1" :after-read="asyncBeforeReadB" :before-read="beforeRead"/>
          </template>
        </van-field>
        <van-field v-model="formData.shopName" name="shopName" label="店铺名称" placeholder="请输入店铺名称" :rules="[{ required: true, message: '请输入店铺名称' }]" class="field-css"/>
        <van-field :value="province_city_area" is-link readonly  name="province_city_area" label="选择地址" placeholder="请选择地址" :rules="[{ required: true, message: '请选择地址' }]" @click="mapShow=true" class="field-css"/>
        <van-field v-model="formData.street" name="street" label="详细地址" placeholder="请输入详细地址" :rules="[{ required: true, message: '请输入详细地址' }]" class="field-css"/>
        <div style="margin: 16px;"><van-button round block type="info" native-type="submit">提交</van-button></div>
      </van-form>
      <van-popup v-model="mapShow"  position="right" style="width: 100%;height: 100%" >
        <van-nav-bar title="选择地址" left-text="返回" @click-left="mapShow=false" />
        <iframe id="mapPage" style="width: 100%;height: calc(100% - 2.875rem)" frameborder=0  scrolling="no"
                src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=TYDBZ-AFDWW-UKNRV-O3GBO-L6J26-MFFQZ&referer=myapp">
        </iframe>
      </van-popup>
    </div>
</template>

<script>
export default {
  name: 'takeOut',
  data () {
    return {
      mapShow: false,
      province_city_area: '',
      logo_uuid: [],
      foodHygieneLicense: [],
      foodBusinessLicense: [],
      formData: {
        openid: this.$cookie.get('openid'), // 登录接口返回的openid
        shopName: '', // 店铺名称
        longitude: '', // 经度
        latitude: '', // 纬度
        province: '', // 店铺地址：省
        city: '', // 店铺地址：市
        area: '', // 店铺地址：区县
        street: '', // 店铺地址：街道门牌
        foodHygieneLicense: '', // 食品卫生许可证UUID（图片上传接口返回）
        foodBusinessLicense: '', // 食品经营许可证UUID(图片上传接口返回)
        logo_uuid: '' // 店铺logo UUID(图片上传接口返回)
      }
    }
  },
  methods: {
    onSubmit () {
      console.log(this.formData)
      this.applyTakeOut(this.formData)
    },
    applyTakeOut (e) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/registration_business', e).then(res => {
          if (res.data.resultCode === 0) {
            this.$toast.success({
              message: '提交成功\n等待审核',
              forbidClick: true,
              onClose: () => {
                let takeOut = this.$cookie.getJSON('take-out')
                takeOut.state = 'APPLYING'
                this.$cookie.set('take-out', {
                  state: takeOut.state,
                  refuse_reason: takeOut.refuse_reason || ''
                })
                this.$router.go(-1)
              }
            })
            resolve(res)
          } else {
            this.$toast.fail(res.data.errorMsg)
            reject(res)
          }
        }).catch(e => {
          this.$toast.fail('申请外卖接口失败')
          console.log(e)
          reject(e)
        })
      })
    },
    beforeRead (file) {
      let arr = ['jpeg', 'jpg', 'png', 'gif'].filter(item => file.type.indexOf(item) !== -1 ? item : '')
      if (!arr.length) {
        this.$toast.fail('请上传 jpeg,jpg,png,gif 格式图片')
        return false
      }
      return true
    },
    asyncBeforeReadA (file) { // foodHygieneLicense 食品卫生许可证UUID（图片上传接口返回）
      console.log(file)
      return new Promise((resolve, reject) => {
        let arr = ['jpeg', 'jpg', 'png', 'gif'].filter(item => file.file.type.indexOf(item) !== -1 ? item : '')
        if (!arr.length) {
          this.$toast.fail('请上传 jpeg,jpg,png,gif 格式图片')
          reject(file)
        } else {
          this.uploader_img(file.file, 'foodHygieneLicense')
          resolve()
        }
      })
    },
    asyncBeforeReadB (file) { // foodBusinessLicense 食品经营许可证UUID(图片上传接口返回)
      console.log('asyncBeforeRead', file)
      return new Promise((resolve, reject) => {
        let arr = ['jpeg', 'jpg', 'png', 'gif'].filter(item => file.file.type.indexOf(item) !== -1 ? item : '')
        if (!arr.length) {
          this.$toast.fail('请上传 jpeg,jpg,png,gif 格式图片')
          reject(file)
        } else {
          this.uploader_img(file.file, 'foodBusinessLicense')
          resolve()
        }
      })
    },
    asyncBeforeReadC (file) { // logo_uuid 店铺logo UUID(图片上传接口返回)
      return new Promise((resolve, reject) => {
        let arr = ['jpeg', 'jpg', 'png', 'gif'].filter(item => file.file.type.indexOf(item) !== -1 ? item : '')
        if (!arr.length) {
          this.$toast.fail('请上传 jpeg,jpg,png,gif 格式图片')
          reject(file)
        } else {
          this.uploader_img(file.file, 'logo_uuid')
          resolve()
        }
      })
    },
    uploader_img (e, key) {
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
            this.formData[key] = res.data.pic_uuid
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
    }
  },
  mounted () {
    console.log(this.$cookie.getJSON('take-out'))
    window.addEventListener('message', (event) => {
      var loc = event.data
      console.log(event.data)
      if (loc.module === 'locationPicker') {
        if (loc.poiaddress.indexOf('省') === -1) return this.$toast.fail('请选择正确地址')
        let poiaddress = loc.poiaddress
        let province = loc.poiaddress.indexOf('省') + 1
        let city = loc.poiaddress.indexOf('市') + 1
        let area = loc.poiaddress.indexOf('区') !== -1 ? loc.poiaddress.indexOf('区') + 1 : loc.poiaddress.indexOf('县') !== -1 ? loc.poiaddress.indexOf('县') + 1 : loc.poiaddress.indexOf('市') + 1
        this.formData.province = poiaddress.substring(0, province)
        this.formData.city = poiaddress.substring(province, city)
        this.formData.area = poiaddress.substring(city, area)
        this.province_city_area = this.formData.province + '-' + this.formData.city + '-' + this.formData.area
        this.formData.street = poiaddress.substring(area, poiaddress.length)
        this.formData.longitude = loc.latlng.lng
        this.formData.latitude = loc.latlng.lat
        this.mapShow = false
      }
      // console.log('你使用的组件是' + loc.module + ',刚选择了' + loc.poiname + ',它位于' + loc.poiaddress + ',它的经纬度是：' + loc.latlng.lat + ',' + loc.latlng.lng + ',所属城市为:' + loc.cityname)
    }, false)
  }
}
</script>
<style>
  .takeOut-div .van-field__control{
    text-align: right;
    justify-content: flex-end;
  }
</style>
<style scoped>
  .field-css{
    margin-bottom: 0.5rem;
  }
</style>
