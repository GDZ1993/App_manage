<template>
  <div>
    <div style="position: fixed;width: 100%;top: 0;left: 0;z-index: 99;">
      <van-nav-bar title="折扣活动" left-text="返回" @click-left="$router.push('/home')" right-text="添加折扣" @click-right="$router.push('/addDiscount')" />
    </div>
    <div style="height: 3rem"></div>
    <van-list v-model="loading" @load="onLoad" :finished="finished" finished-text="没有更多了">
      <van-panel title="折扣活动" :status="item.activity ? '进行中': '已结束'" v-for="(item,index) in discountArr" :key="item.id">
        <div class="discount-content" >
          <van-card :desc="item.others" :thumb="$picture_src + item.relative_path">
            <div slot="title" style="margin-bottom: 0.5rem">
              <div class="row-between">商品名称: <p>{{item.foodName }}</p></div>
            </div>
            <div slot="tag">
              <div style="margin-bottom: 0.5rem" v-if="item.scan_mark"><van-tag mark type="primary">堂食</van-tag></div>
              <div><van-tag mark type="primary" v-if="item.takeout_mark">外卖</van-tag></div>
            </div>
            <div slot="tags" >
              <div class="row-between">开始时间: <p>{{item.begin_Time }}</p></div>
              <div class="row-between" style="margin-bottom: 0.5rem">结束时间: <p>{{item.end_Time}}</p></div>
              <div style="margin-bottom: 0.5rem" v-if="item.scan_mark">
                <div class="row-between">堂食折扣: <p>{{item.percentage * 10}}折</p></div>
                <div class="row-between">
                  <p>堂食金额: </p>
                  <p>
                    <span style="text-decoration:line-through;color:rgba(119,119,119,1);margin-left: 0.5rem">原价:￥{{item.noramlPrice - 0}}</span>
                    <span >优惠价:￥{{item.discountPrice - 0}}</span>
                  </p>
                </div>
                <div class="row-between">限购数量: <p>{{item.purchaseLimits || '不限'}}</p></div>
              </div>
              <div v-if="item.takeout_mark">
                <div class="row-between">外卖折扣: <p>{{item.take_percentage * 10}}折</p></div>
                <div class="row-between">
                  <p>外卖金额: </p>
                  <p>
                    <span style="text-decoration:line-through;color:rgba(119,119,119,1);margin-left: 0.5rem">原价:￥{{item.takeout_price - 0}}</span>
                    <span >优惠价:￥{{item.takeDiscountPrice - 0}}</span>
                  </p>
                </div>
                <div class="row-between">限购数量: <p>{{item.take_purchase_limits || '不限'}}</p></div>
              </div>
            </div>
          </van-card>
        </div>
        <div slot="footer" class="row-end">
          <van-button type="info" size="small" style="margin-right: 1rem" :to="{name: 'addDiscount', params: {type: 1, id: item.id}}">编辑</van-button>
          <van-button size="small" type="warning" @click="delete_click(item, index)">删除</van-button>
        </div>
      </van-panel>
      <Without v-if="!discountArr.length"></Without>
    </van-list>
  </div>
</template>

<script>
export default {
  name: 'discount',
  data () {
    return {
      error: false,
      loading: false,
      finished: false,
      sele: '',
      discountArr: [],
      pages: 0,
      Number: 1
    }
  },
  methods: {
    onLoad (e) {
      if (this.discountArr.length >= this.Number) {
        this.finished = true
      } else {
        this.pages += 1
        this.infoRequest()
      }
    },
    onSearch (e) {
      console.log(e)
    },
    delete_click (t, i) {
      this.$dialog.confirm({
        title: '删除折扣',
        message: '确定要删除折扣吗?'
      }).then(() => {
        this.deleteRequest(t, i)
      })
    },
    deleteRequest (t, i) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/Discount/Delete', {
          discountID: t.id,
          scan_mark: true,
          takeout_mark: true
        }).then(res => {
          if (res.data.resultCode === 0) {
            this.$toast.success({
              message: '删除成功',
              forbidClick: true,
              onClose: () => {
                this.discountArr.splice(i, 1)
              }
            })
            resolve(res)
          } else {
            this.$toast.fail(res.data.errorMsg)
            reject(res)
          }
        })
      })
    },
    infoRequest () {
      return new Promise((resolve, reject) => {
        this.$ajax.post('/Discount/selectSingleDiscounts', {
          openid: this.$cookie.get('openid'),
          pages: this.pages
        }).then(res => {
          if (res.data.resultCode === 0) {
            res.data.discountList.forEach(t => {
              t.activity = this.$Time(t.end_Time) > this.$Time(new Date())
            })
            if (!res.data.discountList.length) this.finished = true
            this.discountArr = res.data.discountList
            this.loading = false
            this.$toast.clear()
            resolve(res)
          } else {
            this.$toast.fail(res.data.errorMsg)
            reject(res)
          }
        }).catch(e => {
          this.$toast.clear()
        })
      })
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
  .discount-content {
    padding: 1rem;
  }

  .search-css {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
  }

  .van-cell-group {
    margin-bottom: 0.5rem;
  }

  .van-card__price {
    width: 100%;
  }
  .van-search__action:active {
    background-color: transparent;
  }

</style>
