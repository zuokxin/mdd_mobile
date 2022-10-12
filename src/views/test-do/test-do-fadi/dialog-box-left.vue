<template>
  <div>
    <div class="main">
      <div class="boxLeft" :style="{color: '#333' }">{{textLeft}}</div>
      <div class="laba" :style="{background: !isPlay || isHistory ? '#fff':'#34B7B9' }" @click.once="playAudio">
        <img v-show="isPlay  && !isHistory" src="@/assets/img/test/horn.gif" width="12" height="12" alt="-">
        <img v-if="(!isPlay && !isHistory) || isHistory" src="@/assets/img/test/speaker.png" alt="speaker" style="width: 13px; height: 13px;">
      </div>
    </div>
  </div>
</template>

<script>
import Music from '@/utils/music'
export default {
  name: 'dialog-box-left',
  props: {
    textLeft: String,
    url: String,
    needAnswer: Boolean,
    isHistory: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isPlay: true, // 正在播放
      player: null
    }
  },
  mounted () {
    if (this.url) {
      const vm = this
      this.player = new Music(this.url)
      this.player.addEventListener('load', function () {
        this.play()
        const interval = setInterval(() => {
          if (this.source.playStatus !== 2) {
            clearInterval(interval)
            vm.isPlay = false
            vm.player = null
            vm.$emit('palyAudio', true)
          }
        }, 0)
      })
    }
  },
  beforeDestroy () {
    if (this.player) {
      this.player.stop()
      this.player = null
    }
  },
  methods: {
    playAudio () {
      if (!this.isPlay) return
      if (this.player) this.player.stop()
    }
  }
}
</script>
<style lang="less" scoped>
.main {
  display: flex;
  align-items: center;
}
.boxLeft {
  min-width: 40px;
  max-width: 70%;
  min-height: 30px;
  padding: 6px 14px;
  display: inline-block;
  position: relative;
  background: #FFFFFF;
  border-radius: 8px;
  margin: 10px 0;
  margin-left: 26px;
  font-size: 14px;
  color: #555555;
}
.boxLeft:after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: -13px;
  width: 17px;
  height: 15px;
  border-width: 0;
  border-style: solid;
  border-color: transparent;
  margin-right: -1px;
  border-bottom-width: 8px;
  border-bottom-color: currentColor;
  border-radius: 0 0 34px 0;
  color: #FFFFFF;
  transform: rotateX(180deg) rotateZ(-115deg);
}
.laba {
  width: 22px;
  height: 22px;
  background: #34B7B9;
  border-radius: 50%;
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
