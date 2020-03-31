<template>
  <div style="background: white">
    <div style="position: fixed;width: 100%;top: 0;left: 0;z-index: 99;">
      <van-nav-bar title="商品分类" left-text="返回" @click-left="$router.go(-1)" >
        <div slot="right">
          <van-icon name="apps-o" @click="popupShow=true" size="1.5em"/>
        </div>
      </van-nav-bar>
    </div>
    <div style="height: 2.875rem;"></div>
    <van-swipe-cell v-for="(item,index) in classify_arr" :key="item.id" class="swipe-cell-css">
      <div class="row-between" style="padding: 0.5rem">
        <div><p style="font-size: 1rem">{{item.level1Name}}</p>
          <p style="font-size: 0.75rem; color: #666666">{{item.counts || 0}}个商品</p></div>
        <div>
          <van-button type="info" size="small" icon="edit" @click="update_click(item,index)">编辑</van-button>
          <van-button type="primary" size="small" icon="add-o" :to="{ name: 'addGoods', params: {menu_level1_id: item.id,level1Name: item.level1Name}}">新建商品</van-button>
        </div>
      </div>
      <van-button slot="right" type="danger" size="small" icon="delete" @click="delete_click(item,index)">删除</van-button>
    </van-swipe-cell>
    <van-overlay :show="dialog_show" @click="dialog_show = false" class="column-div">
      <div class="overlay-css" @click.stop>
        <p class="overlay-headline">{{dialog_headline}}</p>
        <van-form @submit="onSubmit">
          <van-field v-model="formDate.level1_name" name="level1_name" label="分类名称" placeholder="请输入分类名称"
                     :rules="formRules['level1_name']"/>
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit">提交</van-button>
          </div>
        </van-form>
      </div>
    </van-overlay>
    <div style="height: 3.5rem;background: #F1F1F1"></div>
    <van-popup v-model="popupShow" position="right" style="width: 50%;height: 100%">
      <van-cell icon="add-o" title="新增分类" is-link  @click="add_click"/>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'classifyList',
  data () {
    return {
      popupShow: false,
      sele: '',
      dialog_show: false,
      dialog_headline: '添加分类',
      formDate: {
        level1_name: ''
      },
      formRules: {
        level1_name: [{required: true, message: '请输入分类名称'}]
      },
      classify_arr: []
    }
  },
  methods: {
    onSearch () {
      console.log(this.sele)
    },
    update_click (e, index) {
      let entity = this.classify_arr[index]
      this.dialog_headline = '编辑分类'
      this.formDate = {
        id: entity.id,
        level1_name: entity.level1Name,
        index: index
      }
      this.dialog_show = true
    },
    onSubmit (e) {
      if (this.formDate.id) {
        this.update_Request(this.formDate)
      } else {
        this.add_Request(e)
      }
    },
    add_click () {
      this.popupShow = false
      this.dialog_headline = '添加分类'
      this.formDate = {
        level1_name: ''
      }
      this.dialog_show = true
    },
    update_Request (e) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/menuLevel1', {
          opt: 'UPDATE',
          level1_id: e.id,
          level1_name: e.level1_name
        }).then(res => {
          if (res.data.resultCode === 0) {
            this.classify_arr[this.formDate.index] = {
              id: this.formDate.id,
              level1Name: this.formDate.level1_name
            }
            this.formDate = {
              level1_name: ''
            }
            this.dialog_show = false
            this.$toast.success('操作成功')
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
    },
    add_Request (e) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/menuLevel1', {
          opt: 'ADD',
          openid: this.$cookie.get('openid'),
          level1_name: e.level1_name
        }).then(res => {
          if (res.data.resultCode === 0) {
            this.formDate = {
              level1_name: ''
            }
            this.classify_arr.unshift({
              id: res.data.id,
              level1Name: e.level1_name
            })
            this.dialog_show = false
            this.$toast.success('操作成功')
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
    },
    delete_click (e, index) {
      this.$dialog.confirm({
        title: '删除分类',
        message: '确定要删除该分类吗?'
      }).then(() => {
        this.deleteRequest(e, index)
      })
    },
    deleteRequest (e, index) {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/menuLevel1', {
          'opt': 'DELETE',
          'level1_id': e.id,
          'level1_name': e.level1Name
        }).then(res => {
          if (res.data.resultCode === 0) {
            this.classify_arr.splice(index, 1)
            this.$toast.success('操作成功')
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
    },
    requestClassify () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/menuLevel1', {
          'opt': 'SELECT',
          'openid': this.$cookie.get('openid')
        }).then(res => {
          if (res.data.resultCode === 0) {
            if (res.data.menuLevel1List) {
              res.data.menuLevel1List.forEach(item => {
                item.text = item.level1Name
              })
              this.classify_arr = res.data.menuLevel1List
            }
            resolve(res)
            this.$toast.clear()
          } else {
            reject(res)
            this.$toast.fail(res.data.errorMsg)
          }
        }).catch(e => {
          console.log(e)
          reject(e)
          this.$toast.fail('请求失败')
        })
      })
    }
  },
  mounted () {
    this.requestClassify()
  }
}
</script>
<style>
  .swipe-cell-css .van-swipe-cell__right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
<style scoped>
  .swipe-cell-css {
    width: 100%;
    border-bottom: 1px solid #fafafa;
  }

  .overlay-css {
    width: 90%;
    background: white;
    border-radius: 0.5rem;
  }

  .overlay-headline {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    color: #666666;
    text-align: center;
  }

  .goods-action-div {
    width: 100%;
    height: 100%;
    box-shadow: 0px 10px 8px 10px rgba(55, 55, 55, 0.4);
    padding: 0.5rem;
  }

  .newAddbut {
    border: none;
  }

  .search-css {
    width: 100%;
    position: fixed;
    top: 3rem;
    left: 0;
    z-index: 10;
  }
</style>
