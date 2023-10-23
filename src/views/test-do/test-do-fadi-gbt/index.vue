<template>
  <div>
    <FadiIos/>
  </div>
</template>
<script>
import FadiIos from './fadi-ios.vue'
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
  name: 'fadi-gbt',
  components: {
    FadiIos
  },
  data () {
    return {
    }
  },
  created () {
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
