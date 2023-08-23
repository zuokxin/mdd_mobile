import wx from 'weixin-js-sdk' // 微信sdk依赖
import { wxSignatures } from '@/api/index'
// 要用到微信API
function getJSSDK (data, dataForm, callback) {
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
    openTagList: ['wx-open-launch-app'],
    success: (res) => {
      // alert(res, 'success')
    }
  })
  wx.ready(function () {
    if (callback) {
      const params = { type: 'ready', code: 200 }
      callback(params)
    }
    wx.updateAppMessageShareData({
      title: dataForm.title,
      desc: dataForm.desc,
      link: dataForm.link,
      imgUrl: dataForm.imgUrl,
      success: function success (res) {
        // alert(res, '成功')
        if (callback) {
          const params = { type: 'share', code: 200 }
          callback(params)
        }
      },
      cancel: function cancel (res) {
        if (callback) {
          const params = { type: 'share', code: 300 }
          callback(params)
        }
        // alert('已取消');
      },
      fail: function fail (res) {
        if (callback) {
          const params = { type: 'share', code: 400 }
          callback(params)
        }
        // alert(res, '失败')
      }
    })
    // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
    // wx.onMenuShareTimeline({
    //   title: dataForm.title,
    //   link: dataForm.link,
    //   imgUrl: dataForm.imgUrl,
    //   success: function success (res) {
    //     // alert('已分享');
    //   },
    //   cancel: function cancel (res) {
    //     // alert('已取消');
    //   },
    //   fail: function fail (res) {
    //     // alert(JSON.stringify(res));
    //   }
    // })
  })
  wx.error((res) => {
    console.log(JSON.stringify(res) + '微信验证失败')
  })
}

// 分享其他页面
const share = (isMain = true) => {
  const currentUrl = window.location.href
  const url = currentUrl.split('#')[0]
  const dataForm = {
    title: '云愈心理，专业高效的AI心理测评',
    desc: '云愈心理提供专业高效的心理测评，让你更懂得自己',
    link: isMain ? currentUrl : url + '#/my-index',
    imgUrl: 'https://s1.ax1x.com/2022/04/11/LVs3i6.png'
  }
  wxSignatures({ url: currentUrl }).then(res => {
    if (res.code === 0) {
      getJSSDK(res.data, dataForm)
    }
  })
}

// 禁用分享
const hiddenShare = () => {
  wx.hideOptionMenu()
}

export default {
  getJSSDK,
  share,
  hiddenShare
}
