<template>
    <div class="moneyOff-div">
      <div style="position: fixed;width: 100%;top: 0;left: 0;z-index: 99;">
        <van-nav-bar title="整单满减" left-text="返回" @click-left="$router.push('/setting')" >
          <div slot="right">
            <van-dropdown-menu class="dropdown-menu-css">
              <van-dropdown-item title="筛选" ref="item">
                <div slot="title"><van-icon name="apps-o" size="1.5em"/></div>
                <van-cell title="添加整单满减" is-link to="moneyOffAdd" />
                <van-switch-cell :value="switch_cell" title="开启整单满减" @change="switch_request" :loading="switch_loading"/>
              </van-dropdown-item>
            </van-dropdown-menu>
          </div>
        </van-nav-bar>
      </div>
      <div style="height: 2.875rem"></div>
      <van-panel title="整单满减" :status="$Time(item.endTime) > $Time(new Date()) ? '进行中' : '已结束'" v-for="(item,index) in minusList" :key="item.id">
        <div style="padding: 1rem">
          <van-cell title="开始时间" :value="item.beginTime"/>
          <van-cell title="结束时间" :value="item.endTime"/>
          <van-cell title="满减优惠" >
            <div slot="default">
              <van-tag plain type="warning">满{{item.sumMoney }}</van-tag>
              <van-tag plain type="warning">减{{item.minusMoney }}</van-tag>
            </div>
          </van-cell>
          <van-cell title="特价菜品" :value="item.contain_bargain - 0 ? '是' : '否'"/>
          <van-cell title="包含堂食" :value="item.scan_mark ? '是' : '否'"/>
          <van-cell title="包含外卖" :value="item.takeout_mark ? '是' : '否'" v-if="$cookie.getJSON('take-out').state === 'APPROVED'"/>
        </div>
        <div slot="footer" class="row-end">
          <van-button size="small" type="warning" style="margin-left: 1rem" @click="delete_click(item,index)">删除</van-button>
        </div>
      </van-panel>
    </div>
</template>

<script>
export default {
  name: 'moneyOff',
  data () {
    return {
      switch_loading: false,
      switch_cell: false,
      state: false,
      entity: null,
      minusList: []
    }
  },
  methods: {
    switch_request () {
      this.switch_loading = true
      return new Promise((resolve, reject) => {
        this.$ajax.post('/switch', {
          openid: this.$cookie.get('openid'),
          type: 1,
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
        this.$ajax.post('/AllBillMinus/selectAll', {
          openid: this.$cookie.get('openid')
        }).then(res => {
          if (res.data.resultCode === 0 && res.data.constantData) {
            this.entity = res.data.constantData
            this.state = this.$Time(res.data.constantData.endTime) > this.$Time(new Date())
            this.minusList = res.data.minusList
            let boo = false
            if (res.data.constantData.switch_mark) boo = true
            this.switch_cell = boo
            this.$toast.clear()
            resolve(res)
          } else {
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
    delete_click (item, index) {
      this.$dialog.confirm({
        title: '提示',
        message: '确定要删除该整单折扣吗?'
      }).then(() => {
        this.delete_Reuqest(item, index)
      })
    },
    delete_Reuqest (item, index) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/AllBillMinus/Delete', {
          AllBillMinusID: item.id
        }).then(res => {
          if (res.data.resultCode === 0) {
            this.$toast.success({
              message: '操作成功',
              forbidClick: true,
              onClose: () => {
                this.minusList.splice(index, 1)
              }
            })
            resolve(res)
          } else {
            this.$toast.clear()
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
  .moneyOff-div .orderDiscount-Add{
    border-color: white;
  }
  .dropdown-menu-css .van-cell__title{
    text-align: left;
  }
</style>
<style scoped>
.van-cell-group{
  margin-bottom: 0.5rem;
}
</style>
