<template>
  <div class="popout" v-if="popoutShow">
    <div class="popout_box"  v-if="step1">
      <div class="popout_body">
        <img src="@/assets/img/start-prompt.gif" alt="">
        <div class="text"> <span>{{countTime}}</span> 秒后即将播报语音 </div>
        <div class="text">注意调整到合适的音量</div>
      </div>
    </div>
    <div class="popout_box2"  v-if="step2">
      <div class="popout_title"><img src="@/assets/img/close.png" @click="close" alt=""></div>
      <div class="popout_text"></div>
      <div class="popout_body">
        <img src="@/assets/img/start-prompt.gif" alt="">
        <div class="text"> 接下来，您将会进入到人机交互测试阶段，会有虚拟医生与您访谈，请尽可能如实地描述自己。在听到每道问题后，您需要正对设备回答。 </div>
      </div>
      <div class="progress">
        <!-- <audio  ref="video" src="../../../assets/guide-audio.mp3"  webkit-playsinline="true" playsinline="true" id="audio"></audio> -->
        <van-progress :percentage="percentage" stroke-width="5px" color="#34B7B9"  :show-pivot="false" />
      </div>
    </div>
  </div>
</template>

<script>
import Music from './music'
export default {
  name: 'popout',
  props: {
    countTime: Number,
    popoutShow: Boolean
  },
  data () {
    return {
      step1: true,
      step2: false,
      player: null,
      interval: null,
      timeNow: 0, // 音频播放时间
      timeAll: 0 // 音频时长
    }
  },
  computed: {
    percentage () {
      return this.timeAll ? (this.timeNow / this.timeAll * 100) >= 100 ? 100 : this.timeNow / this.timeAll * 100 : 0
    }
  },
  watch: {
    countTime (newV, oldV) {
      if (newV === 0) {
        this.step1 = false
        this.step2 = true
        this.playAudio()
        // this.$nextTick(() => {
        //   this.playAudio()
        // })
      }
    }
  },
  mounted () {
  },
  methods: {
    playAudio () {
      const vm = this
      this.player = new Music(require('@/assets/guide-audio.mp3'))
      this.player.addEventListener('load', function () {
        this.play()
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
          // console.log('end')
          vm.$emit('close')
          // if (vm.popoutShow) {
          //   console.log('end2')
          //   vm.$emit('close')
          // }
        }
      })
    },
    close () {
      this.timeNow = 0
      this.timeAll = 0
      if (this.player?.source.playStatus === 2) {
        this.player.source.stop()
      }
      // console.log('end3')
      // this.$emit('close')
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
    height: calc(100% - 4.8919rem);
    background-color: #FFFFFF;
    overflow: hidden;
    .popout_body{
      text-align: center;
      img{
        width: 4.0541rem;
        height: 4.0541rem;
        margin: 2.4865rem  0px  1.8649rem;
      }
      .text{
        font-size: 14px;
        text-align: center;
        color: #333333;
        font-weight: 500;
        span{
          display: inline-block;
          width: .5405rem;
          font-size: 30px;
          color: #34B7B9;
        }
      }
    }
  }
  .popout_box2{
    border-radius: 20px;
    width: calc(100% - 1.3514rem);
    height: calc(100% - 4.8919rem);
    background-color: #FFFFFF;
    overflow: hidden;
    .popout_title{
      margin-top: .6486rem;
      margin-bottom: .4054rem;
      padding-right: .7838rem;
      text-align: right;
      img{
        width: .8108rem;
        height: .8108rem;
        cursor: pointer;
      }
    }
    .popout_text{
      height: 20px;
      width: 100%;
      line-height: 20px;
      color: #34B7B9;
      text-align: center;
      font-weight: 600;
    }
    .popout_body{
      text-align: center;
      img{
        width: 4.0541rem;
        height: 4.0541rem;
        margin: .1622rem 0  .8649rem;
      }
      .text{
        font-size: 14px;
        padding: 0 1.2162rem;
        text-align: center;
        color: #333333;
        font-weight: 500;
      }
    }
    .progress{
      padding: 0 1.2162rem;
      margin-top: .8108rem;
    }
  }
}
</style>
