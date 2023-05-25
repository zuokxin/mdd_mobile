<template>
  <div class="face-box" ref="point" :style="`height:${divHeight}px;left:${moveLeft}px;top:${moveTop}px;`"
    @touchstart.prevent="(e)=>{dragStart(e)}" @touchend.prevent="(e)=>{dragEnd(e)}"  @touchmove.prevent="(e) => dragMove(e)">
    <video-box
      ref="thisVideo"
      :faceDetection="true"
      @getFace="getFace"
      :icon="true"
      size="120px"
    >
    </video-box>
  </div>
</template>

<script>
import VideoBox from './VideoBox'
export default {
  name: 'drag-video',
  props: {
    location: Object
  },
  components: {
    VideoBox
  },
  data () {
    return {
      // 摄像头信息
      moveLeft: 0, // 左边界&drop
      moveTop: 0, // 上边界&drop
      divWidth: 90,
      divHeight: 120,
      face: null,
      videoObject: null
    }
  },
  mounted () {
    this.videoObject = this.$refs.thisVideo
    // 设置摄像头框初始位置
    if (this.location) {
      const { top = 0, left = 0, right = 0, bottom = 0 } = this.location
      if (top) {
        this.moveTop = top
      } else if (bottom) {
        this.moveTop = document.body.clientHeight - this.divHeight - bottom
      }
      if (left) {
        this.moveLeft = left
      } else if (right) {
        this.moveLeft = document.body.clientWidth - this.divWidth - right
      }
    }
    this.$nextTick(() => {
      this.divWidth = this.$refs.point.clientWidth
    })
  },
  watch: {
  },
  methods: {
    // 设置视频流
    setSteam (stream) {
      this.videoObject.videoBox.srcObject = stream
    },
    // 启动视频
    initVideo (stream) {
      // this.setSteam(stream)
      // this.playVideo()
      console.log('in')
      this.videoObject.setVideoSrc(stream)
    },
    // 播放
    playVideo () {
      this.videoObject.play()
    },
    // 暂停
    pauseVideo () {
      this.videoObject.pause()
    },
    // 重启
    restartVideo () {
      this.playVideo()
      this.videoObject.started()
    },
    // 人脸识别
    getFace (e) {
      this.$emit('getFace', e)
      this.face = e
    },
    /************************
     *      摄像头拖拽
    *************************/
    // face-box关于脱拽
    dragStart () {
      this.$refs.point.style.transition = 'none'
    },
    dragEnd () {
      this.$refs.point.style.transition = 'all 0.3s'
    },
    dragMove (e) {
      this.divWidth = this.$refs.point.clientWidth
      // 位置移动最小和最大的点
      if (e.touches.length) {
        const touch = e.touches[0]
        console.log(touch)
        this.moveLeft = touch.clientX - (this.divWidth / 2)
        // const fa = document.getElementsByClassName('test-do-other')[0]
        if (this.moveLeft <= 0) {
          this.moveLeft = 0
        }
        const clientWidth = document.body.clientWidth
        const clientHeight = document.body.clientHeight
        if (this.moveLeft >= clientWidth - this.divWidth) {
          this.moveLeft = clientWidth - this.divWidth
        }
        this.moveTop = touch.clientY - (this.divHeight / 2)
        if (this.moveTop <= 0) {
          this.moveTop = 0
        }
        if (this.moveTop >= clientHeight - this.divHeight) {
          this.moveTop = window.clientHeight - this.divHeight
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.face-box{
    position: absolute;
    z-index: 10;
  }
</style>
