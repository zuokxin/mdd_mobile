<template>
  <!-- 视频画布播放版本 -->
  <div class="dialog-box-left">
    <div class="main">
      <div class="boxLeft" :style="{ color: '#333' }">{{ textLeft }}</div>
      <div v-if="isReady" class="laba" :style="{ background: !isPlay || isHistory ? '#fff' : '#34B7B9' }"
        @click.once="pauseVideo">
        <img v-show="isPlay && !isHistory" src="@/assets/img/test/horn.gif" width="12" height="12" alt="-">
        <img v-if="(!isPlay && !isHistory) || isHistory" src="@/assets/img/test/speaker.png" alt="speaker"
          style="width: 13px; height: 13px;">
      </div>
      <div v-else class="laba run" :style="{ background: '#fff' }">
        <icon-font name="#mdd-loading-01" color="#999"></icon-font>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import browser from '@/utils/browser'
export default {
  name: 'dialog-box-left',
  props: {
    textLeft: String,
    url: String,
    // 历史记录显示
    isHistory: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isPlay: true, // 正在播放
      isReady: false, // 是否正在加载
      timer: null, // 视频渲染计时器
      startTime: 0,
      videoEle: null, // 视频元素
      canvas: null, // 画布元素
      ctx: null,
      sParams: {}, // 切割视频定位尺寸
      ios: browser().ios
    }
  },
  mounted () {
    this.$nextTick(() => {
      // 历史不读
      if (this.isHistory) {
        this.isReady = true
        return
      }
      // 画布初始化
      this.canvas = document.getElementById('canvas')
      if (!this.canvas) {
        this.canvas = document.createElement('canvas')
        this.canvas.id = 'canvas'
        this.canvas.className = 'dialog-box-left-video'
        // 处理渲染图片不清晰问题
        this.canvas.width = (window.innerWidth || document.body.clientWidth) * 4
        this.canvas.height = (window.innerHeight || document.body.clientHeight) * 4
        // this.canvas.width = (window.innerWidth || document.body.clientWidth)
        // this.canvas.height = (window.innerHeight || document.body.clientHeight)
        this.canvas.style = 'z-index: 1'
        document.getElementById('tableFadi').appendChild(this.canvas)
      }
      this.ctx = this.canvas.getContext('2d')
      // 视频初始化
      this.videoEle = document.getElementById('dialogVideo')
      if (!this.videoEle) {
        this.videoEle = document.createElement('video')
        this.videoEle.id = 'dialogVideo'
        this.videoEle.src = this.url
        this.videoEle.crossOrigin = 'anonymous'
        this.videoEle.preload = 'auto'
        this.videoEle.style = 'display:none'
        // 视频行内播放设置
        this.videoEle.setAttribute('webkit-playsinline', 'webkit-playsinline')
        this.videoEle.setAttribute('playsinline', 'playsinline')
        document.getElementById('tableFadi').appendChild(this.videoEle)
        // ios需要先load()，否则拿不到第一帧
        if (this.ios) this.videoEle.load()
        this.$emit('openStartPrompt')
        // 数据加载后再显示弹窗
        // let isLoad = false
        // const loadedmetadata = () => {
        //   isLoad = true
        //   // ios需要先load()，否则拿不到第一帧
        //   if (this.ios) this.videoEle.load()
        //   this.$emit('openStartPrompt')
        //   this.videoEle.removeEventListener('loadedmetadata', loadedmetadata)
        // }
        // this.videoEle.addEventListener('loadedmetadata', loadedmetadata)
        // // 部分ios微信端监听不到loadedmetadata事件
        // // 手动执行loadedmetadata事件后还是存在画面无法绘制的问题
        // let times = 1
        // const waitLoad = setInterval(() => {
        //   // 是否监听到加载
        //   if (isLoad) {
        //     clearInterval(waitLoad)
        //   } else {
        //     if (times === 3) {
        //       clearInterval(waitLoad)
        //       // 手动触发加载
        //       loadedmetadata()
        //     }
        //     times++
        //   }
        // }, 500)
      } else {
        // 视频元素已存在
        this.videoEle.autoplay = true
        this.videoEle.src = this.url
        // this.play()
        // 渲染后开始计时
        this.setTimer()
      }
      // 插入fadi页面中，后退可一起销毁
      this.videoEle.addEventListener('play', this.played)
      this.videoEle.addEventListener('pause', this.paused)
      this.$once('hook:beforeDestroy', () => {
        this.videoEle.removeEventListener('play', this.played)
        this.videoEle.removeEventListener('pause', this.paused)
      })
    })
  },
  beforeDestroy () {
    // 页面离开暂停播放
    console.log('页面离开暂停播放')
    this.pauseVideo()
  },
  methods: {
    // 加载计时
    setTimer () {
      this.startTime = (new Date()).getTime()
      this.timer = setInterval(() => {
        const currtime = (new Date()).getTime()
        // 比10s大
        if (currtime - this.startTime >= 10000) {
          clearInterval(this.timer)
          this.timer = null
          // 超过10s没有加载出视频显示提示
          if (!this.isReady) {
            Dialog.alert({
              message: '视频加载失败，请重试',
              theme: 'round-button',
              className: 'detail-dialog',
              confirmButtonText: '重新加载',
              confirmButtonColor: '#34B7B9'
            }).then(() => {
              // 视频重新渲染
              this.videoEle.src = this.url
              // 如果是第一个没有自动播放，需要后续加上
              if (!this.videoEle.autoplay) this.videoEle.autoplay = true
              this.setTimer()
            })
          }
        }
      }, 1000)
      // 中途离开避免继续计时触发
      this.$once('hook:beforeDestroy', () => {
        if (this.timer) clearInterval(this.timer)
      })
    },
    // 手动播放
    play () {
      this.videoEle.play()
    },
    // 开始播放
    played () {
      console.log('触发played事件')
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      this.isReady = true
      // 计算裁切部分
      this.calc()
      // 能绘制就显示播放
      if (this.sParams.sh !== 0) this.isPlay = true
      // 初始记录第一帧图片
      this.ctx.drawImage(this.videoEle, this.sParams.sx, this.sParams.sy, this.sParams.sw, this.sParams.sh, 0, 0, this.canvas.width, this.canvas.height)
      // this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
      // 间隔40毫秒绘制一次
      const i = setInterval(() => {
        if (this.sParams.sh === 0) {
          this.calc()
        } else {
          // 如果上面第一次绘制没有触发
          if (!this.isPlay) this.isPlay = true
          this.ctx.drawImage(this.videoEle, this.sParams.sx, this.sParams.sy, this.sParams.sw, this.sParams.sh, 0, 0, this.canvas.width, this.canvas.height)
        }
        if (this.videoEle.ended || this.videoEle.paused) {
          this.isPlay = false
          clearInterval(i)
        }
      }, 0)
    },
    // 视频暂停（自动播放结束和手动暂停）
    paused () {
      this.isPlay = false
      // 暂停并将视频归位
      // this.videoEle.currentTime = 0
      // 画布重绘第一帧
      // this.ctx.putImageData(this.imageData, 0, 0)
      this.$emit('playVideo', true)
      // 视频清空（ios会有回音，产生原因不明）
      this.videoEle.src = ''
      this.videoEle.removeEventListener('play', this.played)
      this.videoEle.removeEventListener('pause', this.paused)
    },
    // 手动暂停
    pauseVideo () {
      if (!this.isPlay) return
      this.videoEle.pause()
    },
    // 计算裁切部分
    calc () {
      this.videoEle = document.getElementById('dialogVideo')
      const { videoWidth, videoHeight } = this.videoEle
      const scaleVideoHeight = videoWidth * (this.canvas.height / this.canvas.width)
      const vParam = this.ios ? 1.1 : 2 // ios需要整体上拉一些防止盖住脸
      const videoY = (videoHeight - scaleVideoHeight) / vParam
      this.sParams = {
        sx: 0,
        sy: videoY,
        sw: videoWidth,
        sh: scaleVideoHeight
      }
    }
  }
}
</script>
<style>
.dialog-box-left-video {
  position: fixed;
  width: 100vw;
  height: calc(100 * var(--vh));
  top: 0;
  left: 0;
  z-index: 0;
  width: 100vw;
  height: calc(100 * var(--vh));
  object-fit: cover;
  transform: scaleX(1);
}
</style>
<style lang="less" scoped>
.main {
  display: flex;
  align-items: flex-end;
  padding: 10px 0;
}

.boxLeft {
  min-width: 40px;
  max-width: 70%;
  min-height: 20px;
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;
  position: relative;
  background: rgba(255, 255, 255, .8);
  border-radius: 8px;
  // margin: 10px 0;
  margin-left: 16px;
  font-size: 14px;
  color: #000;
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
  color: rgba(255, 255, 255, .8);
  transform: rotateX(180deg) rotateZ(-115deg);
}

.laba {
  width: 22px;
  height: 22px;
  background: rgba(52, 183, 185, .8);
  border-radius: 50%;
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: .8;

  &.run {
    animation: run .5s infinite;
  }
}

@keyframes run {
  0% {
    transform: rotateZ(360deg);
  }

  100% {
    transform: rotateZ(0deg);
  }
}</style>
