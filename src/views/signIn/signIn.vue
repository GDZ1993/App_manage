<template>
    <div>
      <div style="position: fixed;width: 100%;top: 0;left: 0;z-index: 99;">
        <van-nav-bar title="注册" left-text="返回" @click-left="$router.go(-1)" />
      </div>
      <div style="height: 2.875rem"></div>
      <van-form @submit="onSubmit">
        <van-field v-model="account" name="用户名" label="用户名" placeholder="用户名" :rules="[{ required: true, message: '请填写用户名' }]" @blur="account_blur">
          <van-icon :name="count == 0 ? 'success' : 'cross'" :color="count == 0 ? '#07c160' : 'red'" slot="left-icon" v-if="count !== -1"/>
        </van-field>
        <van-field v-model="password" type="password" name="密码" label="密码" placeholder="密码" :rules="[{ required: true, message: '请填写密码' }]" />
        <div style="margin: 16px;"><van-button round block type="info" native-type="submit">提交</van-button></div>
      </van-form>
    </div>
</template>

<script>
export default {
  name: 'signIn',
  data () {
    return {
      account: '',
      password: '',
      count: -1
    }
  },
  methods: {
    onSubmit () {
      if (this.count === 1 || this.count === -1) return this.$toast.fail('用户名被占用')
      this.add_request()
    },
    account_blur () {
      if (!this.account) return
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      return new Promise((resolve, reject) => {
        this.$ajax.post('/account', {
          account: this.account
        }).then(res => {
          if (res.data.resultCode === 0) {
            this.count = res.data.count
            res.data.count === 1 ? this.$toast.fail('用户名被占用') : this.$toast.clear()
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
    add_request () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0
      })
      console.log('opeind', this.$cookie.get('userOpenid'))
      return new Promise((resolve, reject) => {
        this.$ajax.post('/registration', {
          opeind: this.$cookie.get('userOpenid'),
          account: this.account,
          password: this.password
        }).then(res => {
          if (res.data.resultCode === 0) {
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
  }
}
</script>

<style scoped>
</style>
