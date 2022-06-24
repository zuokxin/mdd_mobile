<template>
  <div class="popout" v-if="voicePopout">
    <div class="popout_box">
      <div class="popout_title"><img src="@/assets/img/close.png"  @click="voiceClose" alt=""></div>
      <div class="popout_body">
        <img src="@/assets/img/Virtual-Doctor.gif" alt="">
        <slot name="text"></slot>
      </div>
      <div class="progress">
        <van-progress :percentage="percentage" stroke-width="5px" color="#34B7B9" :show-pivot="false" />
      </div>
    </div>
  </div>
</template>

<script>
import Music from './music'
export default {
  name: 'popout',
  props: {
    voicePopout: Boolean,
    xx: Number
  },
  data () {
    return {
      player: null,
      interval: null,
      closeShow: false,
      timeNow: 0, // 音频播放时间
      timeAll: 0 // 音频时长
    }
  },
  watch: {
    voicePopout (newV, oldV) {
      this.timeAll = 0
    }
  },
  computed: {
    percentage () {
      return this.timeAll ? ((this.timeNow / this.timeAll * 100) >= 100 ? 100 : (this.timeNow / this.timeAll * 100)) : 0
    }
  },
  methods: {
    playAudio (url) {
      const vm = this
      // console.log(url)
      this.closeShow = false
      this.player = new Music(url)
      this.player.addEventListener('load', function () {
        this.play()
        this.closeShow = true
        vm.timeAll = this.audioBuffer.duration
        // 计时器
        vm.interval = setInterval(() => {
          const { context, source } = this
          const playStatus = source.playStatus
          vm.timeNow = context.currentTime
          if (playStatus === 2) {
            vm.timeNow = context.currentTime
          } else {
            vm.timeNow = vm.timeAll
            clearInterval(vm.interval)
          }
        }, 100)
        vm.player.source.onended = () => {
          vm.player.source.playStatus = 1
          if (vm.voicePopout) {
            // this.timeNow = 0
            // this.timeAll = 0
            vm.$emit('voiceClose')
          }
        }
      })
    },
    voiceClose () {
      // this.timeNow = 0
      // this.timeAll = 0
      console.log(this.player?.source.playStatus)
      if (this.player?.source.playStatus === 2) {
        this.player.source.stop()
      }
      // this.player.source.stop()
      this.$emit('voiceClose')
    }
  },
  beforeDestroy () {
    if (this.player?.source.playStatus === 2) {
      this.player.source.stop()
    }
  }
}
</script>

<style lang="less" scoped>
.popout{
  z-index: 100;
  width: 100vw;
  font-size: 16px;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
   .popout_box{
      border-radius: 20px;
      width: calc(100% - 1.3514rem);
      // height: calc(100% - 4.8919rem);
      height: 14.7838rem;
      background-color: #FFFFFF;
      overflow: hidden;
    .popout_title{
      padding-top: .6486rem;
      height: .7297rem;
      padding-right: .7838rem;
      text-align: right;
      img{
        width: .7297rem;
        height: .7297rem;
        cursor: pointer;
      }
    }
    .popout_body{
      text-align: center;
      height: 12rem;
      overflow: hidden;
      img{
        width: 4.0541rem;
        height: 4.0541rem;
      }
      .text{
        padding:  0 1.2162rem;
        font-size: 14px;
        text-align: center;
        color: #333333;
        font-weight: 500;
      }
    }
    .progress{
      padding: 0 .8649rem;
    }
  }
}
</style>
