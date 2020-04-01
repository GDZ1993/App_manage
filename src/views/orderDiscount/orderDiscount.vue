<template>
    <div class="orderDiscount-div">
      <div style="position: fixed;width: 100%;top: 0;left: 0;z-index: 99;">
        <van-nav-bar title="整单折扣" left-text="返回" @click-left="$router.push('/setting')" >
          <div slot="right">
            <van-dropdown-menu class="dropdown-menu-css">
              <van-dropdown-item title="筛选" ref="item">
                <div slot="title"><van-icon name="apps-o" @click="popupShow=true" size="1.5em"/></div>
                <van-cell title="添加整单折扣" is-link to="orderDiscountUpdate" />
                <van-switch-cell :value="switch_cell" title="开启整单折扣" @change="switch_change" :loading="switch_loading"/>
              </van-dropdown-item>
            </van-dropdown-menu>
          </div>
        </van-nav-bar>
      </div>
      <div style="height: 2.875rem"></div>
      <van-panel title="整单折扣" :status="state ? '进行中' : '已结束'" v-if="entity">
        <div style="padding: 1rem">
          <van-cell title="开始时间" :value="entity.begin_time"/>
          <van-cell title="结束时间" :value="entity.end_time"/>
          <van-cell title="整单折扣" :value="entity.discount + '折'"/>
          <van-cell title="包含特价菜品即折上折" :value="entity.contain_bargain ? '是' : '否'"/>
          <van-cell title="包含堂食" :value="entity.switch_mark ? '是' : '否'"/>
          <van-cell title="包含外卖" :value="entity.takeout_mark ? '是' : '否'"/>
        </div>
        <div slot="footer" class="row-end">
          <van-button size="small" type="warning" style="margin-left: 1rem" @click="delete_click">删除</van-button>
        </div>
      </van-panel>
    </div>
</template>

<script>
export default {
  name: 'orderDiscount',
  data () {
    return {
      switch_loading: false,
      switch_cell: false,
      state: false,
      entity: {
        begin_time: '',
        contain_bargain: 0,
        discount: '',
        end_time: ''
      }
    }
  },
  methods: {
    switch_change () {
      this.switch_request()
    },
    switch_request () {
      this.switch_loading = true
      return new Promise((resolve, reject) => {
        this.$ajax.post('/switch', {
          openid: this.$cookie.get('openid'),
          type: 0,
          switch_mark: !this.switch_cell ? 1 : 0
        }).then(res => {
          if (res.data.resultCode === 0) {
            this.switch_loading = false
            this.switch_cell = !this.switch_cell
            resolve(res)
          } else {
            this.switch_loading = false
            this.$toast.fail(res.data.errorMsg)
            reject(res)
          }
        }).catch(e => {
          this.switch_loading = false
          this.$toast.fail('接口失败')
          console.log(e)
          reject(e)
        })
      })
    },
    request (e) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/AllBillDiscount/Select', {
          openid: this.$cookie.get('openid')
        }).then(res => {
          if (res.data.resultCode === 0 && res.data.allBillDiscountInfo) {
            this.entity = res.data.allBillDiscountInfo
            this.state = this.$Time(new Date()) > this.$Time(new Date(this.entity.end_time))
            this.$toast.clear()
            resolve(res)
          } else {
            this.entity = null
            reject(res)
            this.$toast.clear()
          }
        }).catch(e => {
          this.$toast.clear()
          console.log(e)
          reject(e)
        })
      })
    },
    delete_click () {
      this.$dialog.confirm({
        title: '提示',
        message: '确定要删除该整单折扣吗?'
      }).then(() => this.delete_Reuqest())
    },
    delete_Reuqest () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/AllBillDiscount/Delete', {
          openid: this.$cookie.get('openid')
        }).then(res => {
          if (res.data.resultCode === 0) {
            this.$toast.success({
              message: '操作成功',
              forbidClick: true,
              onClose: () => {
                this.entity = null
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
    }
  },
  beforeMount () {
    this.request()
  }
}
</script>

<style >
  .orderDiscount-div .orderDiscount-Add{
    border-color: white;
  }
  .dropdown-menu-css .van-cell__title{
    text-align: left;
  }
</style>
