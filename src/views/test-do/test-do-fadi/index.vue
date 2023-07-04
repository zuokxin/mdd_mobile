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
  }
}
</script>
