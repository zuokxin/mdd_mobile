<template>
  <div class="face-box" ref="point" :style="`width:${divWidth}px;height:${divHeight}px;left:${moveLeft}px;top:${moveTop}px;`"
    @touchstart.prevent="(e)=>{dragStart(e)}" @touchend.prevent="(e)=>{dragEnd(e)}"  @touchmove.prevent="(e) => dragMove(e)">
    <video-box
      ref="thisVideo"
      :faceDetection="true"
      @getFace="getFace"
      :icon="false"
      size="92px"
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
      divWidth: 92,
      divHeight: 92,
      face: null,
      videoObject: null
    }
  },
  mounted () {
    this.videoObject = this.$refs.thisVideo
    // 设置摄像头框初始位置
    if (this.location) {
      const { top = 0, left = 0, right = 0 } = this.location
      this.moveTop = top
      if (left) {
        this.moveLeft = left
      } else if (right) {
        this.moveLeft = document.body.clientWidth - 92 - right
      }
    }
  },
  methods: {
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
      // 位置移动最小和最大的点
      if (e.touches.length) {
        const touch = e.touches[0]
        this.moveLeft = touch.clientX - this.divWidth + 46
        // const fa = document.getElementsByClassName('test-do-other')[0]
        if (this.moveLeft <= 0) {
          this.moveLeft = 0
        }
        const clientWidth = document.body.clientWidth
        const clientHeight = document.body.clientHeight
        if (this.moveLeft >= clientWidth - 92) {
          this.moveLeft = clientWidth - 92
        }
        this.moveTop = touch.clientY - this.divHeight + 46
        if (this.moveTop <= 0) {
          this.moveTop = 0
        }
        if (this.moveTop >= clientHeight - 92) {
          this.moveTop = window.clientHeight - 92
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
    border-radius: 10px;
    background-color: rgba(255,255,255,.2);
    filter: blur(2px);
    box-shadow: 0 0 2px #333;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /deep/.img-box {
    position: relative;
    border-radius: 10px;
    overflow: auto;
    video {
      mix-blend-mode: screen;
    }
  }
</style>
