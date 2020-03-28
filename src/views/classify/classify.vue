<template>
    <div class="goods-div">
      <div style="position: fixed;width: 100%;top: 0;left: 0;z-index: 99;" v-if="!infoType">
        <van-nav-bar title="商品分类" left-text="返回" @click-left="$router.go(-1)" >
          <div slot="right">
            <van-icon name="apps-o" @click="popupShow=true" size="1.5em"/>
          </div>
        </van-nav-bar>
      </div>
      <div style="height: 2.875rem" v-if="!infoType"></div>
      <slot name="title"></slot>
      <van-tree-select :height="!infoType ? 'calc(100% - 3.125rem)' : '100%'" :items="classify_arr" :main-active-index.sync="active" @click-nav="nav_click">
        <template slot="content">
          <!--<GoodsItem v-for="item in goods_arr" :key="item.id" :entity="item" :classify="classify" />-->
          <component :is="!infoType ? 'GoodsItem' : 'SelectGoodsItem'" v-for="item in goods_arr" :key="item.id" :entity="item" :classify="classify" @select_event="select_event"></component>
          <Without v-if="!goods_arr.length"></Without>
        </template>
      </van-tree-select>
      <!--<van-goods-action safe-area-inset-bottom class="goods-action" v-if="!infoType">
        <div class="goods-action-div row-between">
          <router-link class="row-div routerLink-css" to="/classifyList">
            <van-icon name="cluster-o" color="#FFD99B"/>
            <span style="color: #333333">分类管理</span>
          </router-link>
          <router-link class="row-div" style="margin-right: 0.5rem" v-if="classify_arr[active]"  >
            <van-icon name="add-o" color="#FFD99B"/>
            <span style="color: #333333">新增商品</span>
          </router-link>
        </div>
      </van-goods-action>-->
      <van-popup v-model="popupShow" position="right" style="width: 50%;height: 100%">
        <van-cell icon="cluster-o" title="分类管理" is-link to="/classifyList"/>
        <van-cell icon="add-o" title="新增商品" is-link :to="{name: 'addGoods', params: {menu_level1_id: classify_arr[active].id,level1Name: classify_arr[active].level1Name}}" v-if="classify_arr[active]"/>
      </van-popup>
    </div>
</template>

<script>
import GoodsItem from '../../components/goodsItem/goodsItem'
import SelectGoodsItem from '../../components/selectGoodsItem/selectGoodsItem'
export default {
  components: {
    GoodsItem,
    SelectGoodsItem
  },
  name: 'classify',
  props: {
    infoType: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      popupShow: false,
      active: 0,
      classify_arr: [],
      classify: {
        id: ''
      },
      goods_arr: []
    }
  },
  methods: {
    select_event (e) {
      this.$emit('select_event', e)
    },
    nav_click (e) {
      console.log(this.classify_arr)
      this.classify = this.classify_arr[e]
      this.requestGoods()
    },
    deleteItem (items) {
      let inx = -1
      this.goods_arr.forEach((item, index) => {
        if (item.id === items.id) inx = index
      })
      if (inx !== -1) this.goods_arr.splice(inx, 1)
    },
    requestGoods (e) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/level1FoodList', {
          'menu_level1_id': this.classify.id || ''
        }).then(res => {
          if (res.data.resultCode === 0) {
            this.goods_arr = res.data.foodList
            this.$toast.clear()
            resolve(res)
          } else {
            this.$toast.fail('请求失败')
            reject(res)
          }
        }).catch(e => {
          console.log(e)
          this.$toast.fail('请求失败')
          reject(e)
        })
      })
    },
    requestClassify () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/menuLevel1', {
          opt: 'SELECT',
          openid: this.$cookie.get('openid')
        }).then(res => {
          if (res.data.resultCode === 0) {
            if (res.data.menuLevel1List && res.data.menuLevel1List.length > 0) {
              res.data.menuLevel1List.forEach(item => {
                item.text = item.level1Name
              })
              this.classify_arr = res.data.menuLevel1List
            }
            this.$toast.clear()
            resolve(res)
          } else {
            reject(res)
            this.$toast.fail('请求失败')
          }
        }).catch(e => {
          console.log(e)
          this.$toast.fail('请求失败')
          reject(e)
        })
      })
    }
  },
  mounted () {
    this.requestClassify().then(res => this.classify_arr.length > 0 ? this.nav_click(0) : '')
  }
}
</script>

<style scoped>
.goods-div{
  width: 100%;
  height: 100vh;
}
  .goods-action-div{
    width: 100%;
    height: 100%;
    box-shadow:0px 10px 8px 10px rgba(55,55,55,0.4);
  }
  .routerLink-css{
    width: 7.812rem;
    height: 100%;
    background: #fafafa;
  }

.van-sidebar-item--select {
  border-color: #1989fa;
}
</style>
