
import axios from 'axios'
import { Notify, Dialog } from 'vant'
import router from '../router'

// 创建axios实例，请求头编写格式
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
      // if (res.code === 401) {
      //   msgBox('当前登录信息已失效，请重新登录')
      // } else if (res.code === 606) { // 其他设备登录
      //   msgBox(res.message)
      // } else if (res.code === 607) { // 注销
      //   msgBox(res.message)
      // } else {
      //   // 提示错误
      //   if (response.config.pushErrMessage) {
      //     thisMessage(res.message)
      //   }
      // }
      // 提示错误
      if (response.config.pushErrMessage) {
        thisMessage(res.message)
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
    const { status, data, config } = err.response || {}
    if (!err.response || !status) { // 无网提示
      thisMessage('哎哟，网络出小差了~')
    } else if (status === 400 && config.pushErrMessage) { // 部分400清空下后端返回业务提示
      if (config.pushErrMessage) {
        // 错误处理
        if (data.code === 401) {
          msgBox('当前登录信息已失效，请重新登录')
        } else if (data.code === 606) { // 其他设备登录
          msgBox(data.message)
        } else if (data.code === 607) { // 注销
          msgBox(data.message)
        } else {
          thisMessage(data.message)
        }
      }
    } else if (status >= 500 && config.pushErrMessage) { // 500以上提示
      thisMessage('服务器开小差了，请稍后再试~')
    }
    return Promise.reject(data)
  }
)

// 错误提示
function thisMessage (message) {
  Notify({
    message: message || 'Error',
    type: 'danger',
    duration: 2000
  })
}
/**
 * 登录弹窗
 * @param message 显示的文案
*/
function thisMessageBox () {
  let timer = null
  return (message) => {
    if (timer) return
    timer = setTimeout(() => {
      clearTimeout(timer)
      timer = null
    }, 1000)
    Dialog.alert({
      message: message,
      theme: 'round-button',
      className: 'detail-dialog',
      confirmButtonText: '确 定',
      confirmButtonColor: '#34B7B9'
    }).then(() => {
      router.push({
        path: '/login',
        query: {
          url: window.location.hash.slice(1)
        }
      })
    })
  }
}

/**
 * 接口函数
 * @param err 是否弹出错误提示，默认弹出
 * @param request 接口信息
*/
export default (request = {}, err = true) => {
  request.pushErrMessage = err
  return http(request)
}
