<template>
    <div class="addDiscount-div">
      <div style="position: fixed;width: 100%;top: 0;left: 0;z-index: 99;">
        <van-nav-bar :title="navBarText" left-text="返回" @click-left="$router.go(-1)" />
      </div>
      <div style="height: 2.875rem"></div>
      <van-form @submit="onSubmit">
        <van-field name="begin_time" :value="formData.begin_time" label="开始时间" :rules="formRules['begin_time']" @click="begin_showPicker = true" placeholder="未设置" readonly clickable right-icon="arrow" />
        <van-field label="结束时间" name="end_time" :value="formData.end_time" :rules="formRules['end_time']" @click="end_showPicker = true"  placeholder="未设置" readonly clickable right-icon="arrow"  class="field-css"/>
        <van-field :value="goodsName" label="选择菜品" name="goodsName" :rules="formRules['food_id']" placeholder="未选择" @click="submitType === 1 ? '' : classify_showPopup = true" readonly clickable right-icon="arrow"/>
        <van-field :value="price" readonly type="number" label="商品原价" name="price" placeholder="未选择商品" :class="!takeout_mark ? 'field-css' : ''"><p slot="button">元</p></van-field>
        <van-field :value="takeout_price" readonly type="number" label="外卖原价" name="price" placeholder="未选择商品" class="field-css" v-if="takeout_mark"><p slot="button">元</p></van-field>
        <van-cell title="价格设置方式" is-link :value="price_Manner"  @click="priceWay" class="field-css"/>
        <div v-if="scan_mark">
          <van-cell title="堂食活动" is-link v-if="submitType === 1"/>
          <van-field name="scan_mark" label="堂食活动" v-else>
            <template #input>
              <van-switch v-model="formData.scan_mark" size="20" />
            </template>
          </van-field>
          <div style="background:white;padding: 1rem 0" class="field-css" v-if="!formData.scan_mark">
            <van-skeleton title :row="2"/>
          </div>
          <div v-else style="width: 100%; background:white;" >
            <van-field v-model="formData.percentage" @blur="per_blur" :readonly="price_MannerType != 1" label="活动力度" type="number"  name="attribute" :rules="formRules['percentage']"  placeholder="请填写优惠折扣[如: 0.75折]"></van-field>
            <van-field v-model="formData.discount_price" @blur="dis_blur" :readonly="price_MannerType != 2" type="number" label="活动价格"  name="discount_price" :rules="formRules['discount_price']" placeholder="请填写堂食活动价格" >
              <p slot="button">元</p>
            </van-field>
            <van-field  name="purchase_limits" label="限购" class="field-css">
              <template #input>
                <van-switch v-model="formData.purchase_limits" size="20" />
              </template>
            </van-field>
          </div>
        </div>
        <div v-if="takeout_mark">
          <van-cell title="外卖活动" is-link v-if="submitType === 1"/>
          <van-field name="takeout_mark" label="外卖活动" v-else>
            <template #input>
              <van-switch v-model="formData.takeout_mark" size="20" />
            </template>
          </van-field>
          <div style="background:white;padding: 1rem 0" v-if="!formData.takeout_mark" class="field-css">
            <van-skeleton title :row="2"/>
          </div>
          <div v-else style="width: 100%; background:white;" >
            <van-field v-model="formData.take_percentage" @blur="takeper_blur" :readonly="price_MannerType == 2" label="活动力度" :rules="formRules['take_percentage']" type="number"  name="attribute" placeholder="请填写优惠折扣[如: 0.75折]"></van-field>
            <van-field :value="formData.take_discount_price"  @blur="takedis_blur" :readonly="price_MannerType == 1 || !price_MannerType" type="number" label="活动价格"  name="discount_price" :rules="formRules['take_discount_price']" placeholder="请填写外卖活动价格" >
              <p slot="button">元</p>
            </van-field>
            <van-field name="take_purchase_limits" label="限购" class="field-css">
              <template #input>
                <van-switch v-model="formData.take_purchase_limits" size="20" />
              </template>
            </van-field>
          </div>
        </div>
        <van-field v-model="formData.discount_count" type="number" :rules="formRules['discount_count']" name="discount_count" label="活动库存" placeholder="请填写库存数量" />
        <van-field v-model="formData.others" rows="2" name="others" :autosize="{maxHeight: 100}" label="备注" type="textarea" placeholder="请填写备注" maxlength="160" show-word-limit class="field-css"/>
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
      <van-popup v-model="price_showPopup" position="bottom" >
        <van-button type="primary" block class="price_Manner" @click="price_Manner = '按折扣',price_MannerType = 1,price_showPopup=false">按折扣</van-button>
        <van-button type="primary" block class="price_Manner" @click="pricediscounts_click">按优惠后价格</van-button>
        <div style="width: 100%;height: 0.5rem;background: #F1F1F1"></div>
        <van-button type="warning" block @click="price_showPopup = false">取消</van-button>
      </van-popup>
      <van-popup v-model="classify_showPopup"   position="right" style="width:100%;height: 100%;">
        <div class="classify-showPopup-content">
          <div style="position: fixed;width: 100%;top: 0;left: 0;z-index: 99;">
            <van-nav-bar title="选择商品" left-text="返回" @click-left="classify_showPopup = false" />
          </div>
          <div style="height: 2.875rem"></div>
          <Classify :infoType="1" @select_event="select_event"/>
        </div>
      </van-popup>
    </div>
</template>

<script>
import Classify from '../classify/classify'
export default {
  components: {Classify},
  name: 'addDiscount',
  data () {
    return {
      minDate: new Date(),
      maxDate: new Date(2025, 10, 1),
      submitType: 0,
      navBarText: '添加折扣',
      begin_showPicker: false,
      end_showPicker: false,
      price_showPopup: false,
      classify_showPopup: false,
      goodsName: '',
      price: null,
      takeout_price: null,
      price_Manner: '未选择',
      price_MannerType: null,
      takeout_mark: 0,
      scan_mark: 1,
      formData: {
        food_id: null, // 菜品ID
        begin_time: null, // 活动开始时间
        end_time: null, // 活动结束时间
        take_discount_price: null, // 外卖活动价格
        discount_price: null, // 活动价格
        percentage: null, // 折扣信息，小数表示，例如：8折：0.8
        discount_count: null, // 活动库存
        purchase_limits: true, // 是否每单限一件
        create_time: null, // 活动创建/修改时间
        others: '', // 活动备注
        scan_mark: false,
        takeout_mark: false,
        take_percentage: null,
        take_purchase_limits: true
      },
      formRules: {
        food_id: [{ required: true, message: '请选择商品' }],
        begin_time: [{ required: true, message: '请设置活动开始时间' }],
        end_time: [{ required: true, message: '请设置活动结束时间' }],
        discount_price: [{ required: true, message: '请填写活动价格' }],
        percentage: [{ required: true, message: '请填写活动力度[如: 7.5折]' }],
        purchase_limits: [{ required: true, message: '请填写限购数量' }],
        discount_count: [{ required: true, message: '请填写活动库存数量' }],
        take_discount_price: [{ required: true, message: '请填写外卖活动价格' }],
        take_percentage: [{ required: true, message: '请填写外卖活动力度[如: 7.5折]' }],
        take_purchase_limits: [{ required: true, message: '请填写外卖限购数量' }]
      }
    }
  },
  methods: {
    per_blur () {
      if (!this.formData.percentage || this.price_MannerType !== 1) return
      let num = JSON.parse(JSON.stringify(this.formData.percentage)) - 0
      num > 1 ? this.formData.percentage = 1 : this.formData.percentage = num.toFixed(2) - 0
      this.formData.discount_price = (this.price * this.formData.percentage).toFixed(2) - 0
    },
    dis_blur () {
      if (!this.formData.discount_price || this.price_MannerType !== 2) return
      let num = JSON.parse(JSON.stringify(this.formData.discount_price)) - 0
      if (num > this.price) {
        this.formData.discount_price = this.price
      } else {
        let percentage = this.formData.discount_price / this.price / 10
        this.formData.percentage = percentage.toFixed(2) - 0
        this.formData.discount_price = num.toFixed(2) - 0
      }
    },
    takeper_blur () {
      if (!this.formData.take_percentage || this.price_MannerType !== 1) return
      let num = JSON.parse(JSON.stringify(this.formData.take_percentage)) - 0
      num > 1 ? this.formData.take_percentage = 1 : this.formData.take_percentage = num.toFixed(2) - 0
      this.formData.take_discount_price = (this.takeout_price * this.formData.take_percentage).toFixed(2) - 0
    },
    takedis_blur () {
      if (!this.formData.take_discount_price || this.price_MannerType !== 2) return
      let num = JSON.parse(JSON.stringify(this.formData.take_discount_price)) - 0
      if (num > this.takeout_price) {
        this.formData.take_discount_price = this.takeout_price
      } else {
        let percentage = this.formData.take_discount_price / this.takeout_price / 10
        this.formData.take_percentage = percentage.toFixed(2) - 0
        this.formData.take_discount_price = num.toFixed(2) - 0
      }
    },
    pricediscounts_click () {
      this.price_Manner = '按优惠后价格'
      this.price_MannerType = 2
      this.price_showPopup = false
    },
    priceWay () {
      if (!this.goodsName) return this.$toast.fail('请选择菜品')
      this.price_showPopup = true
    },
    select_event (e) {
      this.takeout_mark = e.takeout_mark
      if (e.takeout_mark) {
        this.takeout_price = e.takeout_price
        this.formData.take_discount_price = e.takeout_price
        this.formData.take_percentage = 1
        this.formData.takeout_mark = true
      }
      this.formData.scan_mark = true
      this.formData.discount_price = e.price
      this.formData.percentage = 1
      this.classify_showPopup = false
      this.formData.discount_count = e.remain
      this.goodsName = e.foodName
      this.price = e.price
      this.formData.food_id = e.id
      this.price_MannerType = 1
      this.price_Manner = '按折扣'
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
      this.formData.create_time = this.$Time(new Date()).format('YYYY-MM-DD HH:mm:ss')
      if (!this.formData.scan_mark && !this.formData.takeout_mark) return this.$toast.fail('请选择活动内容')
      if (this.submitType) {
        this.update_Request()
      } else this.add_Request()
    },
    add_Request () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/Discount/Create', this.formData).then(res => {
          if (res.data.resultCode === 0) {
            this.$toast.success({
              message: '添加成功',
              forbidClick: true,
              onClose: () => {
                this.$router.push('/discount')
              }
            })
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
    update_Request () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/Discount/Update', this.formData).then(res => {
          if (res.data.resultCode === 0) {
            this.$toast.success({
              message: '修改成功',
              forbidClick: true,
              onClose: () => {
                this.$router.push('/discount')
              }
            })
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
    discountDetails (e) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/Discount/selectSingleDiscount', {
          discountID: e
        }).then(res => {
          if (res.data.resultCode === 0) {
            let entity = res.data.discountInfo
            this.takeout_mark = entity.takeout_mark
            this.scan_mark = entity.scan_mark
            let purchaseLimits = false
            let takePurchaseLimits = false
            if (entity.take_purchase_limits) takePurchaseLimits = true
            if (entity.purchaseLimits) purchaseLimits = true
            if (this.takeout_mark) {
              this.takeout_price = entity.takeout_price
              this.formData.take_discount_price = entity.take_discount_price
              this.formData.take_percentage = entity.take_percentage
              this.formData.take_purchase_limits = takePurchaseLimits
              this.formData.takeout_mark = true
            }
            if (this.scan_mark) {
              this.formData.discount_price = entity.discountPrice
              this.formData.percentage = entity.percentage - 0
              this.formData.purchase_limits = purchaseLimits
              this.formData.scan_mark = true
            }
            this.formData.discountID = entity.discountID
            this.goodsName = entity.foodName
            this.price = entity.noramlPrice - 0
            this.formData.food_id = entity.foodId
            this.formData.begin_time = entity.beginTime
            this.formData.end_time = entity.endTime
            this.formData.discount_count = entity.discountCount
            this.price_MannerType = 1
            this.price_Manner = '按折扣'
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
    if (this.$route.params && this.$route.params.type) {
      this.submitType = this.$route.params.type
      this.navBarText = '修改折扣'
      this.discountDetails(this.$route.params.id)
    }
  }
}
</script>
<style>
  .addDiscount-div .van-field__control{
    text-align: right;
    justify-content: flex-end;
  }
</style>
<style scoped>
  .price_Manner{
    border: none;
    color: #323233;
    background: transparent;
  }
  .classify-showPopup-content {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .classify-showPopupheadline{
    width: 100%;
    height: 3.125rem;
  }
  .classify-showPopup-content .goods-div{
    height: calc(100vh - 3.125rem);
  }
  .field-css{
    margin-bottom: 0.5rem;
  }
</style>
