<template>
  <div class="img-box" :style="{ width: size, height: size }">
    <!-- @loadedmetadata="start" -->
    <video
      ref="videoBox"
      src=""
      style="width: 100%; height:100%; object-fit: cover;"
      muted
      playsinline="true"
    >
    <!-- autoplay -->
    </video>
    <!-- <canvas id="videoCanvas" width="150" height="150"></canvas> -->
    <!-- <icon-font
      class="icon"
      name="#mdd-shipinrentoukuang-01"
    ></icon-font> -->
    <!-- <div class="err" v-show="!face"><span>没有检测到人脸</span></div> -->
  </div>
</template>

<script>
// import * as faceapi from 'face-api.js'
export default {
  name: 'video-box',
  components: {
  },
  props: {
    stream: {
      type: Object,
      default: () => {}
    },
    size: {
      type: String,
      default: '12rem'
    },
    faceDetection: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ctx: null,
      videoBox: null,
      isPlay: false,
      face: true,
      faceArr: [],
      faceError: false,
      timer: null
    }
  },
  mounted: async function () {
    this.videoBox = this.$refs.videoBox
    // this.$nextTick(() => {
    //   const c = document.getElementById('videoCanvas')
    //   this.ctx = c.getContext('2d')
    //   this.videoBox.addEventListener('play', () => {
    //     const i = window.setInterval(() => {
    //       this.ctx.drawImage(this.videoBox, 0, 0, 150, 150)
    //       // 打印当前视频的播放时间
    //       // console.log(v.currentTime)
    //       // 当视频结束或者暂停的时候去掉循环
    //       if (this.videoBox.paused) {
    //         clearInterval(i)
    //       }
    //     }, 40)
    //   })
    // })
    // if (this.faceDetection) {
    //   faceapi.nets.tinyFaceDetector.loadFromUri('/models').then(
    //     () => {
    //       console.log('ready')
    //     }
    //   )
    // }
  },
  // watch: {
  //   stream (n, o) {
  //     console.log(n, o, 'stream')
  //   }
  // },
  methods: {
    start () {
      const i = window.setInterval(() => {
        this.ctx.drawImage(this.stream, 0, 0, 100, 100)
        // 打印当前视频的播放时间
        // console.log(v.currentTime)
        // 当视频结束或者暂停的时候去掉循环
        if (this.paused) {
          clearInterval(i)
        }
      }, 40)
    },
    play () {
      this.videoBox.play()
      // this.onPlay()
    },
    pause () {
      this.videoBox.pause()
    },
    async setVideoSrc (stream) {
      this.videoBox.srcObject = stream
      if (!this.isPlay) {
        this.videoBox.play()
        this.isPlay = true
      }
    }
    // async start () {
    //   if (this.faceDetection) {
    //     await faceapi.nets.tinyFaceDetector.loadFromUri('/models').then(
    //       () => {
    //         console.log('ready')
    //       }
    //     )
    //     this.onPlay()
    //   }
    // },
    // onPlay () {
    //   if (!this.faceDetection) return
    //   if (this.videoBox.paused) return
    //   const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.6 })
    //   const el = this.$refs.videoBox
    //   faceapi.detectSingleFace(el, options).then(
    //     detection => {
    //       this.face = !!detection
    //       // this.faceArr = [...this.faceArr, this.face]
    //       this.$emit('getFace', this.face)
    //       setTimeout(() => this.onPlay())
    //     }
    //   ).catch(
    //     err => {
    //       console.log(err, 'err')
    //     }
    //   )
    // }
  }
}
</script>

<style lang="less" scoped>
.img-box {
  position: relative;
  // width: 12rem;
  // height: 12rem;
  border-radius: 8px;
  overflow: hidden;
  .icon {
    position: absolute;
    width: 100% !important;
    height: 100% !important;
    top: 0;
    left: 0;
    z-index: 9;
  }
}
.err {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 37px;
  line-height: 37px;
  text-align: center;
  font-size: 12px;
  color: #fff;
  background:rgba(255, 0, 0, .5);
  z-index: 10;
}
</style>
