<template>
    <div class="orderDiscountUpdate">
      <div style="position: fixed;width: 100%;top: 0;left: 0;z-index: 99;">
        <van-nav-bar :title="navBarText" left-text="返回" @click-left="$router.go(-1)" />
      </div>
      <div style="height: 2.875rem"></div>
      <van-form @submit="onSubmit">
        <van-field name="begin_time" label="开始时间" :value="formData.begin_time" :rules="formRules['begin_time']" @click="begin_showPicker = true" placeholder="未设置" readonly clickable right-icon="arrow" />
        <van-field name="end_time" label="结束时间" :value="formData.end_time" :rules="formRules['end_time']" @click="end_showPicker = true"  placeholder="未设置" readonly clickable right-icon="arrow"  class="field-css"/>
        <van-field v-model="formData.discount" type="number" @blur="discount_blur" label="整单折扣" name="price" placeholder="请填写优惠折扣[如: 0.75折]" >
          <p slot="button">折</p>
        </van-field>
        <van-field name="switch" label="特价菜品-即折上折" class="field-css">
          <template #input>
            <van-switch v-model="formData.contain_bargain" size="20" />
          </template>
        </van-field>
        <van-field name="switch" label="堂食折扣">
          <template #input>
            <van-switch v-model="formData.scan_mark" size="20" />
          </template>
        </van-field>
        <van-field name="switch" label="外卖折扣" class="field-css" v-if="$cookie.getJSON('take-out').state === 'APPROVED'">
          <template #input>
            <van-switch v-model="formData.takeout_mark" size="20" />
          </template>
        </van-field>
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
      <van-popup v-model="begin_showPicker" position="bottom">
        <van-datetime-picker type="datetime" @cancel="begin_showPicker = false" :formatter="formatter" @confirm="onbegin_Confirm" />
      </van-popup>
      <van-popup v-model="end_showPicker" position="bottom">
        <van-datetime-picker type="datetime" @cancel="end_showPicker = false" :formatter="formatter" @confirm="onend_Confirm" />
      </van-popup>
    </div>
</template>

<script>
export default {
  name: 'orderDiscountUpdate',
  data () {
    return {
      navBarText: '添加整单折扣',
      begin_showPicker: false,
      end_showPicker: false,
      formData: {
        openid: this.$cookie.get('openid'),
        begin_time: null,
        end_time: null,
        discount: null,
        contain_bargain: false,
        scan_mark: false, // 扫码点餐适用标记
        takeout_mark: false // 外卖适用标记
      },
      formRules: {
        begin_time: [{ required: true, message: '请设置开始时间' }],
        end_time: [{ required: true, message: '请设置结束时间' }],
        discount: [{ required: true, message: '请填写优惠折扣[如: 0.75折]' }]
      }
    }
  },
  methods: {
    discount_blur () {
      if (!this.formData.discount) return
      let num = JSON.parse(JSON.stringify(this.formData.discount)) - 0
      if (num > 1) {
        this.formData.discount = 1
      } else {
        this.formData.discount = num.toFixed(2) - 0
      }
    },
    onend_Confirm (e) {
      this.formData.end_time = this.$Time(e).format('YYYY-MM-DD HH:mm')
      this.end_showPicker = false
    },
    onbegin_Confirm (e) {
      this.formData.begin_time = this.$Time(e).format('YYYY-MM-DD HH:mm')
      this.begin_showPicker = false
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
    onSubmit () {
      let e = JSON.parse(JSON.stringify(this.formData))
      e.contain_bargain = this.formData.contain_bargain ? 1 : 0
      this.add_Reuqest(e)
    },
    add_Reuqest (e) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/AllBillDiscount/Create', e).then(res => {
          if (res.data.resultCode === 0) {
            this.$toast.success({
              message: '添加成功',
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
    }
  }
}
</script>
<style>
  .orderDiscountUpdate .van-field__control{
    text-align: right;
    justify-content: flex-end;
  }
  .orderDiscountUpdate .van-field__label{
    width: 8rem;
  }
</style>
<style scoped>
  .field-css{
    margin-bottom: 0.5rem;
  }
</style>
