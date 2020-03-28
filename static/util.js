import axios from 'axios'
let util = {}
// const ajaxUrl = 'http://39.99.131.249:3381' 脑子真是个好东西:
// util.ajaxUrl = 'https://192.168.1.105:8081'
util.ajaxUrl = 'https://www.ddqcwl.com:8081'
util.ajax = axios.create({
  baseURL: util.ajaxUrl,
  timeout: 60000
})
// http请求拦截器
util.ajax.interceptors.request.use(config => {
  return config
})
// http响应拦截器
util.ajax.interceptors.response.use(res => {
  // console.log(res, '响应拦截器')
  return res
})
util.Random = (quantity, amount) => {
  let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  let arr = []
  for (let k = 0; k < amount; k++) {
    let str = ''
    for (let i = 0; i < quantity; i++) {
      let id = Math.ceil(Math.random() * 35)
      str += chars[id]
    }
    arr.push(str)
  }
  return arr.join('-')
}
export default util
