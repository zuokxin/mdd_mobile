
import axios from 'axios'
import { Notify, Dialog } from 'vant'
import router from '../router'

// 创建axios实例
const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'x-client-type': 'h5',
  'x-client-channel': 'h5',
  'x-client-version': ''
  // 'x-client-version': window.navigator.userAgent
}
const http = axios.create({
  headers,
  timeout: 180000
})
const msgBox = thisMessageBox()
// 添加响应拦截器
http.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    const res = response.data
    if (res.code !== 0) {
      if (res.code === 401) {
        msgBox('当前登录信息已失效，请重新登录')
      } else if (res.code === 606) { // 其他设备登录
        msgBox(res.message)
      } else if (res.code === 607) { // 注销
        msgBox(res.message)
      } else {
        // 提示错误
        if (response.config.pushErrMessage) {
          thisMessage(res.message)
        }
      }
      // if (res.code === 10000) {
      //   router.push({
      //     path: '/login'
      //   })
      // }
      return Promise.reject(res)
    } else {
      return res
    }
  },
  err => {
    console.log('err' + err) // for debug
    const { status, data } = err.response
    if (status >= 500) {
      thisMessage(data.message)
    }
    return Promise.reject(data)
  }
)

function thisMessage (message) {
  Notify({
    message: message || 'Error',
    type: 'danger',
    duration: 2000
  })
}

function thisMessageBox () {
  let timer = null
  return (message) => {
    if (timer) return
    timer = setTimeout(() => {
      clearTimeout(timer)
      timer = null
    }, 1000)
    Dialog.alert({
      message: message
    }).then(() => {
      router.push({
        path: '/login'
      })
    })
  }
}

export default (request = {}, err = true) => {
  request.pushErrMessage = err
  return http(request)
}
