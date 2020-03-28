<template>
    <div class="addGoods-div">
      <div style="position: fixed;width: 100%;top: 0;left: 0;z-index: 99;">
        <van-nav-bar :title="navBarText" left-text="返回" @click-left="$router.go(-1)" />
      </div>
      <div style="height: 2.875rem"></div>
      <van-form @submit="onSubmit">
        <van-field :value="$route.params.level1Name" label="分类名称" readonly class="field-css"/>
        <van-field name="uploader" label="菜品图片" class="field-css" :rules="[{ required: true, message: '请上传商品图片' }]">
          <template #input>
            <van-uploader v-model="uploader" :max-count="1" :after-read="asyncBeforeRead" :before-read="beforeRead"/>
          </template>
        </van-field>
        <van-field v-model="formData.food_name" name="food_name" label="菜品名称" placeholder="请填写菜品名称" :rules="formRules['food_name']" :maxlength="10"/>
        <van-field v-model="formData.price" type="number" label="单价" name="price" placeholder="请填写菜品单价" :rules="formRules['price']" />
        <van-field v-model="formData.remain" type="number" label="库存数量" name="remain" placeholder="请填写菜品库存数量" :rules="formRules['remain']" class="field-css"/>
        <van-field v-model="formData.mark" name="mark" label="标签" placeholder="请填写标签" :maxlength="16" />
        <van-field name="takeout_opt" label="商品状态" class="field-css" >
          <template #input>{{formData.opt ? '上架' : '下架'}}<van-switch v-model="formData.opt" size="20" style="margin-left: 1rem"/></template>
        </van-field>
        <van-field v-model="formData.attribute" name="attribute" label="菜品属性" placeholder="请填写菜品属性" />
        <van-field v-model="formData.describe" name="describe" label="菜品描述" placeholder="请填写菜品描述" :maxlength="16" />
        <van-field v-model="formData.others" rows="2" name="others" :autosize="{maxHeight: 100}" label="备注" type="textarea" placeholder="请填写备注" maxlength="160" show-word-limit class="field-css"/>
        <div v-if="$cookie.getJSON('take-out').state === 'APPROVED'">
          <van-field name="takeout_mark" label="外卖信息" class="field-css" >
            <template #input>
              <van-switch v-model="formData.takeout_mark" size="20" />
            </template>
          </van-field>
          <div style="width: 100%;background: white;padding: 1rem 0"  v-if="!formData.takeout_mark"><van-skeleton title :row="3"/></div>
          <div v-else>
            <van-field v-model="formData.takeout_price" type="number" label="外卖单价" name="price" placeholder="请填写外卖单价" :rules="formRules['takeout_price']" />
            <van-field v-model="formData.packing_charges" type="number" label="包装费" name="price" placeholder="请填写包装费价格" :rules="formRules['packing_charges']" />
            <van-field name="takeout_opt" label="外卖商品状态" class="field-css" >
              <template #input>{{formData.takeout_opt ? '上架' : '下架'}}<van-switch v-model="formData.takeout_opt" size="20" style="margin-left: 1rem"/></template>
            </van-field>
          </div>
        </div>
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </div>
</template>

<script>
export default {
  name: 'addGoods',
  data () {
    return {
      skeleton: false,
      uploader: [],
      navBarText: '添加商品',
      formData: {
        openid: this.$cookie.get('openid'),
        menu_level1_id: '', // 一级菜单ID
        food_name: '', // 菜名
        mark: '', // 菜品标签（最大字符数：16）
        pic_uuid: '', // 图片上传接口返回的UUID
        attribute: '', // 菜品属性（最大字符数：16）
        describe: '', // 菜品描述（最大字符数：128）
        price: '', // 单价（共10位包含小数点后2位）
        remain: '', // 库存数量
        others: '', // 备注（最大字符数：64）
        takeout_price: null, // 外卖单价
        scan_mark: true, // 扫码点餐菜品标记
        takeout_mark: false, // 外卖菜品标记
        packing_charges: null, // 包装费
        opt: true,
        takeout_opt: false
      },
      formRules: {
        food_name: [{ required: true, message: '请填写菜品名称' }],
        mark: [{ required: true, message: '请填写菜品标签' }],
        attribute: [{ required: true, message: '请填写菜品属性' }],
        describe: [{ required: true, message: '请填写菜品描述' }],
        price: [{ required: true, message: '请填写菜品单价' }],
        remain: [{ required: true, message: '请填写菜品库存数量' }],
        takeout_price: [{ required: true, message: '请填写外卖单价' }],
        scan_mark: [{ required: true, message: '请选择商品标记' }],
        takeout_mark: [{ required: true, message: '请选择商品标记' }],
        packing_charges: [{ required: true, message: '请填写包装费' }]
      }
    }
  },
  methods: {
    onSubmit (e) {
      console.log(this.formData, e)
      if (!this.formData.pic_uuid) return this.$toast.fail('请上传菜品图片')
      if (this.formData.food_id) {
        this.update_Request()
      } else {
        this.add_Request()
      }
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
            this.formData.pic_uuid = res.data.pic_uuid
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
    add_Request () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/createFood', this.formData).then(res => {
          if (res.data.resultCode === 0) {
            this.$toast.success({
              message: '操作成功',
              forbidClick: true,
              onClose: () => {
                this.$router.go(-1)
              }
            })
            resolve(res)
          } else {
            this.$toast.fail('提交失败')
            reject(res)
          }
        }).catch(e => {
          this.$toast.fail('请求失败')
          console.log(e)
          reject(e)
        })
      })
    },
    update_Request () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/updateFood', this.formData).then(res => {
          if (res.data.resultCode === 0) {
            this.$toast.success({
              message: '操作成功',
              forbidClick: true,
              onClose: () => {
                this.$router.go(-1)
              }
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
    }
  },
  beforeMount () {
    console.log(this.$route.params)
    if (this.$route.params && this.$route.params.menu_level1_id) {
      if (this.$route.params.form) {
        let e = this.$route.params.form
        this.uploader.push({
          url: this.$picture_src + e.relativePath || ''
        })
        this.navBarText = '修改商品'
        let takeoutMark = false
        let scanMark = false
        let opt = false
        let takeoutOpt = false
        if (e.takeout_mark) takeoutMark = true
        if (e.scan_mark) scanMark = true
        if (e.opt) opt = true
        if (e.takeout_opt) takeoutOpt = true
        this.formData = {
          food_id: e.id,
          food_name: e.foodName || '', // 菜名
          mark: e.mark || '', // 菜品标签（最大字符数：16）
          pic_uuid: e.pic_uuid || '', // 图片上传接口返回的UUID
          attribute: e.attribute || '', // 菜品属性（最大字符数：16）
          describe: e.describes || '', // 菜品描述（最大字符数：128）
          price: e.price || '', // 单价（共10位包含小数点后2位）
          remain: e.remain || '', // 库存数量
          others: e.others || '', // 备注（最大字符数：64）
          takeout_price: e.takeout_price, // 外卖单价
          scan_mark: scanMark, // 扫码点餐菜品标记
          takeout_mark: takeoutMark, // 外卖菜品标记
          packing_charges: e.packing_charges, // 包装费
          opt: opt,
          takeout_opt: takeoutOpt
        }
      } else {
        this.formData.menu_level1_id = this.$route.params.menu_level1_id
      }
    } else {
      this.$toast.fail({
        message: '请先选择分类',
        forbidClick: true,
        onClose: () => {
          this.$router.go(-1)
        }
      })
    }
  }
}
</script>
<style>
  .addGoods-div .van-field__control{
    text-align: right;
    justify-content: flex-end;
  }
</style>
<style scoped>
  .field-css{
    margin-bottom: 0.5rem;
  }
</style>
