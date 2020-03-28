<template>
    <div class="login-div column-div">
      <p style="margin-bottom: 2rem">扫码点餐管理系统</p>
      <van-form @submit="onSubmit">
        <van-field v-model="formData.number" name="用户名" label="用户名" placeholder="请输入用户名" :rules="[{ required: true, message: '请填写用户名' }]" />
        <van-field v-model="formData.password" type="password" name="密码" label="密码" placeholder="请输入密码" :rules="[{ required: true, message: '请填写密码' }]" />
        <div style="margin: 2rem 1rem;">
          <van-button round block type="info" native-type="submit" :loading="butLoading" loading-text="登陆中请稍后...">登录</van-button>
        </div>
      </van-form>
    </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      openid: 'oi1bm1StkEwagvQuHaW7d6Wd7RYI',
      code: '',
      butLoading: false,
      formData: {
        number: '12345678',
        password: '12345678'
      },
      clientType: '',
      audioSrc: require('../../assets/message_inform.mp3'),
      routers: require('../../../static/router')
    }
  },
  methods: {
    onSubmit () {
      if (!this.formData.number && !this.formData.password) return this.$toast.fail('请输入用户名或密码')
      if (!this.formData.number) return this.$toast.fail('请输入用户名')
      if (!this.formData.password) return this.$toast.fail('请输入密码')
      this.butLoading = true
      // localStorage.setItem('routers', JSON.stringify(this.routers))
      this.loginReuqest()
    },
    getOpenid () {
      return new Promise((resolve, reject) => {
        this.$ajax.post('https://39.99.131.249:3381/pay/qcwx/getOpenId', {
          code: this.code
        }).then(res => {
          if (res.data.code === 0) {
            resolve(res)
          } else {
            this.$toast.fail(res.data.errorMsg)
            reject(res)
          }
        }).catch(e => {
          this.$toast.fail('获取openid接口失败')
          reject(e)
        })
      })
    },
    loginReuqest () {
      return new Promise((resolve, reject) => {
        this.$ajax.post('/regist/register', this.formData).then(res => {
          if (res.data.resultCode === 0) {
            localStorage.setItem('routers', JSON.stringify(this.routers))
            this.$cookie.set('openid', res.data.openid)
            this.$cookie.set('take-out', {
              state: res.data.state,
              refuse_reason: res.data.refuse_reason
            })
            this.$store.dispatch('routerAdd', this.routers)
            this.webgetsocket()
            this.butLoading = false
            this.$router.push('/home')
            resolve(res)
          } else {
            this.butLoading = false
            this.$toast.fail(res.data.errorMsg)
            reject(res)
          }
        }).catch(e => {
          this.butLoading = false
          this.$toast.fail('登录接口失败')
          reject(e)
        })
      })
    },
    windowSearch () {
      if (!window.location.search) return ''
      return JSON.parse('{"' + window.location.search.split('?').join('').replace(/=/g, '":"').replace(/&/g, '","') + '"}')
    },
    webgetsocket () {
      if ('WebSocket' in window) {
        var ws = new WebSocket('wss://www.ddqcwl.com:3381/pay/websocket/' + this.$cookie.get('openid'))
        ws.onopen = () => console.log('Web Socket 已连接上...') // Web Socket 已连接上，使用 send() 方法发送数据 ws.send('发送数据')
        ws.onmessage = (evt) => this.socket_message(evt.data) // socket收到一个信息
        ws.onclose = () => console.log('连接已关闭...')// 关闭 websocket
        ws.onerror = () => this.$toast.fail('通信发生错误！') // websocket通信错误！
      } else this.$toast.fail('您的浏览器不支持 WebSocket！')
    },
    socket_message (e) {
      let res = JSON.parse(e)
      let data = JSON.parse(res.data)
      console.log('数据已接收...res.data', data)
      let audio = new Audio()
      audio.src = this.audioSrc
      audio.play()
      res.CMDType === 'NEW_ORDER' ? this.$store.dispatch('setNewsData', data) : this.$store.dispatch('setRefundData', data)
    }
  },
  mounted () {
    let str = window.navigator.userAgent.toLowerCase()
    this.clientType = str.indexOf('alipayclient') > 0 ? 'ALIPAY' : str.indexOf('micromessenger') > 0 ? 'WECHART' : 'WECHART'
    let entity = this.windowSearch()
    if (entity && entity.code) {
      this.code = entity.code
    }
  }
}
</script>
<style>
  .login-div .van-field__control{
    text-align: right;
  }
</style>
<style scoped>
.login-div{
  width: 100%;
  height: 100vh;
  background: white;
}
.van-field__control{
  text-align: right;
}
</style>
