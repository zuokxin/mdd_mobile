<template>
  <div
    class="img-box"
    :style="{ maxWidth: maxWidth, height: size}"
  >
    <video
      id="video"
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
import 'tracking/build/tracking-min'
import 'tracking/build/data/face-min'
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
      timer: null,
      tracker: null
    }
  },
  computed: {
    maxWidth () {
      const computeWidth = (param) => {
        const numStr = this.size.split(param)[0]
        const newNum = +numStr / 9 * 6
        return newNum.toFixed(2) + param
      }
      let res = '100px'
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
  },
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
      if (this.tracker) {
        console.log('pause')
        this.tracker.removeListener('track', this.handleTracked)
        this.tracker = null
      }
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
        if (this.tracker) return
        console.log('started')
        this.tracker = new window.tracking.ObjectTracker('face')
        // 设置步长
        this.tracker.setStepSize(1.5)
        // console.log(window.tracking)
        // console.log(this.tracker)
        this.tracker.on('track', this.handleTracked)
        window.tracking.track('#video', this.tracker)
      }
    },
    handleTracked (event) {
      if (event.data.length === 0) { // 未检测到人脸
        this.$emit('getFace', false)
      } else { // 检测到人脸
        this.$emit('getFace', true)
      }
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
    // top: 0;
    // left: 0;
    // right: 0;
    // bottom: 0;
    // margin: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
