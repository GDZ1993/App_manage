<template>
  <van-card :desc="entity.describes || '暂无'" :title="entity.foodName" :thumb="$picture_src + entity.relativePath" @click="to_lick">
    <div slot="tag" v-if="entity.takeout_mark">
      <van-tag mark type="primary">外卖</van-tag>
    </div>
    <div slot="tags">
      <van-tag plain type="danger" v-if="entity.mark">{{entity.mark}}</van-tag>
      <p>{{entity.attribute}}</p>
      <div class="row-between"><p>库存数量: </p>{{entity.remain}}</div>
      <div class="row-between"><p>堂食价格: </p>￥{{entity.price}}</div>
      <div v-if="entity.takeout_mark">
        <div class="row-between"><p>外卖价格:</p>￥{{entity.takeout_price}}</div>
        <div class="row-between"><p>包装费:</p>￥{{entity.packing_charges}}</div>
      </div>
    </div>
    <div slot="footer">
      <van-button size="mini" type="warning" @click.stop="opt_click('takeout_opt', entity.takeout_opt?false:true)" v-if="entity.takeout_mark">{{entity.takeout_opt ? '外卖下架' : '外卖上架'}}</van-button>
      <van-button size="mini" type="info" @click.stop="opt_click('opt', entity.opt?false:true)">{{entity.opt ? '堂食下架' : '堂食上架'}}</van-button>
    </div>
  </van-card>
</template>

<script>
export default {
  props: {
    entity: {
      type: Object,
      default: null
    },
    classify: Object
  },
  name: 'goodsItem',
  methods: {
    to_lick () {
      console.log(this.entity, this.classify)
      this.$router.push({
        name: 'addGoods',
        params: {
          form: this.entity,
          menu_level1_id: this.classify.id,
          level1Name: this.classify.level1Name
        }
      })
    },
    opt_click (key, e) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      this.$ajax.post('/updateFood', {
        food_id: this.entity.id,
        [key]: e
      }).then(res => {
        if (res.data.resultCode === 0) {
          this.entity[key] = e
          this.$toast.success({
            message: '修改成功',
            forbidClick: true
          })
        } else {
          this.$toast.fail(res.data.errorMsg)
        }
      }).catch(e => {
        this.$toast.fail('接口错误')
        console.log(e)
      })
    }
  }
}
</script>

<style scoped>
  .van-card{
    background: white;
    border-top: 1px solid #fafafa;
  }
  .van-card:first-child{
    border: none;
  }
  .van-button--mini {
    padding: 0 5px;
  }
  .delete-button{
    height: 100%;
  }
</style>
