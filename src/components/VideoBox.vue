<template>
  <div class="img-box" :style="{ maxWidth: maxWidth, height: size }">
    <video
      ref="videoBox"
      src=""
      style="height:100%; object-fit: cover;"
      muted
      playsinline="true"
      @loadedmetadata="started"
    >
    </video>
    <!-- <canvas id="videoCanvas" width="150" height="150"></canvas> -->
    <img v-if="icon" class="icon" src="@/assets/img/video/line.png" alt="icon">
  </div>
</template>

<script>
import * as faceapi from 'face-api.js'
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
      default: '150px'
    },
    faceDetection: {
      type: Boolean,
      default: false
    },
    icon: {
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
  computed: {
    maxWidth () {
      const computeWidth = (param) => {
        const numStr = this.size.split(param)[0]
        const newNum = +numStr / 9 * 6
        return newNum.toFixed(2) + param
      }
      let res = '200px'
      if (this.size.includes('rem')) {
        res = computeWidth('rem')
      } else if (this.size.includes('px')) {
        res = computeWidth('px')
      }
      return res
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
    },
    async started () {
      if (this.faceDetection) {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models').then(
          () => {
            console.log('ready')
          }
        )
        this.onPlay()
      }
    },
    onPlay () {
      if (!this.faceDetection) return
      if (this.videoBox.paused) return
      const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
      const el = this.$refs.videoBox
      faceapi.detectSingleFace(el, options).then(
        detection => {
          this.face = !!detection
          // this.faceArr = [...this.faceArr, this.face]
          this.onPlay()
          this.$emit('getFace', this.face)
          // setTimeout(() => this.onPlay())
        }
      ).catch(
        err => {
          console.log(err, 'err')
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.img-box {
  position: relative;
  // width: 12rem;
  // height: 12rem;
  display: inline-block;
  border-radius: 16px;
  overflow: hidden;
  z-index: 1;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, .6);
    z-index: 8;
  }
  .icon {
    position: absolute;
    height: 60%;
    // width: 100%;
    // height: 100% !important;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
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
