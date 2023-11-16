<template>
  <div>
    <FadiIos v-if="browserType === 'isIOS'"/>
    <FadiAndroid v-else/>
  </div>
</template>
<script>
import browser from '@/utils/browser'
import FadiIos from './fadi-ios.vue'
import FadiAndroid from './fadi-android.vue'
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'hidden') {
    // window.location.reload()
    // 隐藏就不刷新了
  } else {
    // 可见刷新
    window.location.reload()
  }
})
export default {
  name: 'fadi-gbt-index',
  components: {
    FadiIos,
    FadiAndroid
  },
  data () {
    return {
      browserType: ''
    }
  },
  created () {
    if (browser().ios) this.browserType = 'isIOS'
    console.log(this.browserType)
  },
  beforeRouteLeave (to, from, next) {
    // 离开后摄像头红点消失
    if (window.mediaStream) {
      window.mediaStream.getTracks().forEach((track) => {
        track.stop()
      })
    }
    // 离开后摄像头红点消失
    // this.closeMedia()
    next()
  }
}
</script>
