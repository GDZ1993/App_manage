<template>
    <div class="login-div column-div">
      <p style="margin-bottom: 2rem">扫码点餐管理系统</p>
      <van-form @submit="onSubmit">
        <van-field v-model="formData.number" name="用户名" label="用户名" placeholder="请输入用户名" :rules="[{ required: true, message: '请填写用户名' }]" />
        <van-field v-model="formData.password" type="password" name="密码" label="密码" placeholder="请输入密码" :rules="[{ required: true, message: '请填写密码' }]" />
        <div style="margin: 2rem 1rem;">
          <van-button round block type="info" native-type="submit" :loading="butLoading" loading-text="登陆中请稍后..." style="margin-bottom: 0.75rem">登录</van-button>
          <van-button round block type="info" native-type="button" to="signIn" :loading="butLoading" loading-text="登陆中请稍后...">注册</van-button>
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
      routers: require('../../../static/router'),
      userOpenid: ''
    }
  },
  methods: {
    onSubmit () {
      if (!this.formData.number && !this.formData.password) return this.$toast.fail('请输入用户名或密码')
      if (!this.formData.number) return this.$toast.fail('请输入用户名')
      if (!this.formData.password) return this.$toast.fail('请输入密码')
      this.butLoading = true
      this.loginReuqest()
    },
    getOpenid () {
      return new Promise((resolve, reject) => {
        this.$ajax.post('https://www.ddqcwl.com:3381/pay/qcwx/getOpenId', {
          code: this.code
        }).then(res => {
          if (res.data.code === 0) {
            this.userOpenid = res.data.openId
            this.$cookie.set('userOpenid', res.data.openId)
            alert(JSON.stringify(res.data))
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
    merchantsid () {
      return new Promise((resolve, reject) => {
        this.$ajax.post('/merchantsid', {
          openid: this.$cookie.get('userOpenid')
        }).then(res => {
          alert('merchantsid' + JSON.stringify(res.data))
          if (res.data.resultCode === 0) {
            resolve(res)
          } else {
            this.$toast.fail(res.data.errorMsg)
            reject(res)
          }
        }).catch(e => {
          this.$toast.fail('接口失败')
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
        console.log('webgetsocket', this.$cookie.get('openid'))
        ws.onopen = () => console.log('Web Socket 已连接上...')
        ws.onmessage = (evt) => this.socket_message(evt.data)
        ws.onclose = () => console.log('连接已关闭...')
        ws.onerror = () => this.$toast.fail('通信发生错误！')
      } else this.$toast.fail('您的浏览器不支持 WebSocket！')
    },
    socket_message (e) {
      console.log('数据已接收...e', e)
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
    console.log('entity', entity)
    if (entity && entity.code && !this.$cookie.get('userOpenid')) {
      this.code = entity.code
      this.getOpenid().then(res => this.merchantsid())
    } else {
      this.merchantsid()
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
