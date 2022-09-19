<template>
  <div class="popout" v-if="flag && values">
    <div class="popout_box" @click="personGetCoins">
      <img src="@/assets/img/newpersongift.png" alt="">
    </div>
  </div>
</template>
<script>
import { newUserReward } from '@/api/modules/user'

export default {
  name: 'nerpersongift',
  props: {
    flag: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      values: true
    }
  },
  methods: {
    // 新人有礼的其中一个页面需要刷新
    personGetCoins () {
      if (this.type === 'main') {
        this.$emit('reloadCoins')
      } else {
        newUserReward().then(res => {
          if (res.code === 0) {
            this.values = false
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.popout{
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  .popout_box{
    width: 8.1081rem;
    height: 8.4324rem;
    img{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
