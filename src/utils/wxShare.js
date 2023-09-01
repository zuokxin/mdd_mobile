import wx from 'weixin-js-sdk' // 微信sdk依赖
// import { wxSignatures } from '@/api/index'
// 废弃：要用到微信API
// function getJSSDK (data, dataForm, callback) {
//   wx.config({
//     debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//     appId: 'wxb073a9d513bbcd43', // 必填，公众号的唯一标识
//     timestamp: data.timestamp, // 必填，生成签名的时间戳
//     nonceStr: data.noncestr, // 必填，生成签名的随机串
//     signature: data.sign, // 必填，签名
//     jsApiList: [
//       'updateAppMessageShareData',
//       'updateTimelineShareData'
//     ], // 必填，需要使用的JS接口列表
//     openTagList: ['wx-open-launch-app']
//   })
//   wx.ready(function () {
//     if (callback) {
//       const params = { type: 'ready', code: 200 }
//       callback(params)
//     }
//     wx.updateAppMessageShareData({
//       title: dataForm.title,
//       desc: dataForm.desc,
//       link: dataForm.link,
//       imgUrl: dataForm.imgUrl,
//       success: function success (res) {
//         if (callback) {
//           const params = { type: 'share', code: 200 }
//           callback(params)
//         }
//       },
//       cancel: function cancel (res) {
//         if (callback) {
//           const params = { type: 'share', code: 300 }
//           callback(params)
//         }
//       },
//       fail: function fail (res) {
//         if (callback) {
//           const params = { type: 'share', code: 400 }
//           callback(params)
//         }
//       }
//     })
//   })
//   wx.error((res) => {
//     console.log(JSON.stringify(res) + '微信验证失败')
//   })
// }

// 要用到微信API
const getWXSDK = (data) => {
  return new Promise((resolve, reject) => {
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: 'wxb073a9d513bbcd43', // 必填，公众号的唯一标识
      timestamp: data.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.noncestr, // 必填，生成签名的随机串
      signature: data.sign, // 必填，签名
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData'
      ], // 必填，需要使用的JS接口列表
      openTagList: ['wx-open-launch-app']
    })
    wx.ready(function () {
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      resolve()
    })
    wx.error((res) => {
      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      reject(res)
      console.log(JSON.stringify(res) + '微信验证失败')
    })
  })
}

// 废弃：分享其他页面
// const share = (isMain = true) => {
//   const currentUrl = window.location.href
//   const url = currentUrl.split('#')[0]
//   const dataForm = {
//     title: '云愈心理，专业高效的AI心理测评',
//     desc: '云愈心理提供专业高效的心理测评，让你更懂得自己',
//     link: isMain ? currentUrl : url + '#/my-index',
//     imgUrl: 'https://s1.ax1x.com/2022/04/11/LVs3i6.png'
//   }
//   wxSignatures({ url: currentUrl }).then(res => {
//     if (res.code === 0) {
//       getJSSDK(res.data, dataForm)
//     }
//   })
// }

// 设置分享
const setShare = (dataForm = {}) => {
  return new Promise((resolve, reject) => {
    // 默认分享页
    const currentUrl = window.location.href
    const mainUrl = currentUrl.split('#')[0] + '#/my-index'
    wx.updateAppMessageShareData({
      title: dataForm.title || '云愈心理，专业高效的AI心理测评',
      desc: dataForm.desc || '云愈心理提供专业高效的心理测评，让你更懂得自己',
      link: dataForm.link || mainUrl,
      imgUrl: dataForm.imgUrl || 'https://s1.ax1x.com/2022/04/11/LVs3i6.png',
      success: function (res) {
        resolve(res)
      },
      cancel: function (res) {
        const data = { type: 'cancel', res: res }
        reject(data)
        // alert('已取消');
      },
      fail: function (res) {
        const data = { type: 'fail', res: res }
        reject(data)
        // alert(res, '失败')
      }
    })
  })
}

// 禁用分享
const hiddenShare = () => {
  wx.hideOptionMenu()
}

export default {
  // getJSSDK,
  getWXSDK,
  // share,
  setShare,
  hiddenShare
}
