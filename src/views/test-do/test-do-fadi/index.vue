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
export default {
  name: 'fadi-index',
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
    console.log('beforeRouteLeave2', to, from)
    // 离开后摄像头红点消失
    // this.closeMedia()
    next()
  }
}
</script>
