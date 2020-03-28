<template>
  <div class="orderDiscountUpdate">
    <div style="position: fixed;width: 100%;top: 0;left: 0;z-index: 99;">
      <van-nav-bar :title="navBarText" left-text="返回" @click-left="$router.push('/moneyOff')" />
    </div>
    <div style="height: 2.875rem"></div>
    <van-form @submit="onSubmit">
      <van-field name="begin_time" label="开始时间" :value="formData.begin_time" :rules="formRules['begin_time']" @click="begin_showPicker = true" placeholder="未设置" readonly clickable right-icon="arrow" />
      <van-field name="end_time" label="结束时间" :value="formData.end_time" :rules="formRules['end_time']" @click="end_showPicker = true"  placeholder="未设置" readonly clickable right-icon="arrow"  style="margin-bottom: 0.5rem"/>
      <van-field v-model="formData.sum_money" type="number" label="满足金额" name="minus_money" placeholder="请填写满足金额"/>
      <van-field v-model="formData.minus_money" type="number" label="优惠金额" name="sum_money" placeholder="请填写满足金额" style="margin-bottom: 0.5rem"/>
      <van-field name="switch" label="特价菜品-即折上折" style="margin-bottom: 0.5rem">
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
      <van-datetime-picker type="datetime" @cancel="begin_showPicker = false" :formatter="formatter" @confirm="onbegin_Confirm" :min-date="minDate" :max-date="maxDate"/>
    </van-popup>
    <van-popup v-model="end_showPicker" position="bottom">
      <van-datetime-picker type="datetime" @cancel="end_showPicker = false" :formatter="formatter" @confirm="onend_Confirm" :min-date="minDate" :max-date="maxDate"/>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'moneyOffAdd',
  data () {
    return {
      navBarText: '添加满减',
      minDate: new Date(),
      maxDate: new Date(2025, 10, 1),
      begin_showPicker: false,
      end_showPicker: false,
      formData: {
        openid: this.$cookie.get('openid'),
        begin_time: null,
        end_time: null,
        contain_bargain: false,
        minus_money: null,
        sum_money: null,
        scan_mark: false, // 扫码点餐适用标记
        takeout_mark: false // 外卖适用标记
      },
      formRules: {
        begin_time: [{ required: true, message: '请设置开始时间' }],
        end_time: [{ required: true, message: '请设置结束时间' }],
        sum_money: [{ required: true, message: '请填写满足金额' }],
        minus_money: [{ required: true, message: '请填写优惠金额' }]
      }
    }
  },
  methods: {
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
      console.log(e.minus_money, e.sum_money)
      let str = '满足金额: ' + e.sum_money + '\n优惠金额: ' + e.minus_money + '\n满减金额不能小于优惠金额'
      if (e.minus_money - 0 > e.sum_money - 0) return this.$toast.fail(str)
      this.add_Reuqest(e)
    },
    add_Reuqest (e) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/AllBillMinus/Create', e).then(res => {
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
</style>
