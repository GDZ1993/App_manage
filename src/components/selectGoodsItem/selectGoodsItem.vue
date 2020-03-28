<template>
    <div>
      <van-card :desc="entity.describes || '暂无'"  :title="entity.foodName" :thumb="$picture_src + entity.relativePath">
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
          <van-button size="mini" type="info" @click.stop="select_click">选择</van-button>
        </div>
      </van-card>
    </div>
</template>

<script>
export default {
  name: 'selectGoodsItem',
  props: {
    entity: {
      type: Object,
      default: null
    }
  },
  methods: {
    select_click () {
      this.$emit('select_event', this.entity)
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
