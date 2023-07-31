<template>
  <div class="test">
    <div class="test-wrap">
      <div v-if="aiEvalCamEnabled">
        <p class="title">
          <span>摄像头检测</span>
          <img width="28" :src="curImg(faceSuccess)" alt="check-icon">
        </p>
        <p>请将人脸放置在图像框内3秒</p>
        <p class="subtitle test-error" :class="{ 'hidden': !face || faceIndex < 3 }">未识别到人脸，请保持人脸在图像框内。</p>
        <div class="text-center">
          <video-box
            ref="thisVideo"
            :faceDetection="true"
            @getFace="getFace"
            :icon="true"
            size="160px"
          >
          </video-box>
        </div>
        <p class="tips first">
          <span v-if="!faceSuccess"><span class="test-success" style="font-size:0.8rem;margin-right: 7px;">{{ faceIndex }}</span>秒</span>
          <span v-if="faceSuccess" class="test-success">答题时始终保持人脸在图像框内</span>
        </p>
      </div>
      <p class="title">
        <span>语音测试</span>
        <img width="28" :src="curImg(!volumeWarn)" alt="check-icon">
      </p>
      <p>请确保周围环境噪音不高于40分贝</p>
      <p class="subtitle test-error" :class="{ 'hidden': volumeTips }">当前噪音过大</p>
      <p class="tips">
        <b :style="{ color: volumeColor }">{{ db }}</b>
      </p>
    </div>
    <van-button round type="primary" :disabled="!(!volumeWarn && faceSuccess)" @click="start" style="display: block; width: 80%; margin: 20px auto 0;">开始答题</van-button>
  </div>
</template>

<script>
// @ is an alias to /src
import VideoBox from '@/components/VideoBox'
import { mediaErrorTypes } from '@/utils/types'
import Recorder from '@/utils/media/recorder'
// import adapter from 'webrtc-adapter'
import { Dialog } from 'vant'
import { batchInfo } from '@/api/modules/user'
import browser from '@/utils/browser'
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'hidden') {
    // window.location.reload()
    // 隐藏就不刷新了
  } else {
    // 可见刷新
    window.location.reload()
  }
})
export default {
  name: 'ToolsTest',
  components: {
    VideoBox
  },
  beforeRouteLeave (to, from, next) {
    // 离开后摄像头红点消失
    if (window.yunyuStream) {
      const [media01, media02] = window.yunyuStream.getTracks()
      if (media01) media01.stop()
      if (media02) media02.stop()
    }
    next()
  },
  data () {
    return {
      stream: null,
      init: false,
      status: 1,
      recorder: null,
      mediaRecorder: null,
      db: 0,
      volumeWarn: true,
      timer: null,
      face: false,
      faceSuccess: false,
      faceTimer: null,
      faceIndex: 3,
      aiEvalCamEnabled: false // 是否有摄像头
    }
  },
  computed: {
    // 媒体调用参数
    userMediaOptions () {
      if (this.aiEvalCamEnabled) {
        return { audio: true, video: { facingMode: 'user', width: 1280, height: 720 } }
      } else {
        return { audio: true }
      }
    },
    volumeColor () {
      return this.db > 40 ? '#FFB183' : '#34B7B9'
    },
    volumeTips () {
      return this.db <= 40
    },
    sessionId () {
      return this.$route.query.sessionId
    }
  },
  mounted () {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {}
    }
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = constraints => {
        const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia
        if (!getUserMedia) {
          return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
        }
        return new Promise((resolve, reject) => {
          getUserMedia.call(navigator, constraints, resolve, reject)
        })
      }
    }
    // const browserDetails = adapter.browserDetails
    // adapter.browserShim.shimGetDisplayMedia(window, browserDetails)
    // adapter.browserShim.shimGetUserMedia(window, browserDetails)
    // console.log(adapter)
    this.getBatchInfo()
  },
  beforeDestroy () {
    if (this.recorder) this.recorder.close()
    if (this.timer) {
      clearInterval(this.timer)
    }
    if (this.faceTimer) {
      clearInterval(this.faceTimer)
    }
  },
  watch: {
  },
  methods: {
    // 勾选图片
    curImg (status) {
      return status ? require('@/assets/img/checked.png') : require('@/assets/img/unchecked.png')
    },
    // 是否需要打开摄像头&&需要做哪些量表的信息
    async getBatchInfo () {
      const res = await batchInfo({ sessionId: this.sessionId })
      this.aiEvalCamEnabled = res.data.aiEvalCamEnabled || false
      this.faceSuccess = !this.aiEvalCamEnabled
      this.initUserMedia()
    },
    // 人脸识别
    getFace (n) {
      // 人脸识别启动时再显示提示文字
      this.face = true
      if (this.faceSuccess) return
      if (!n) {
        if (this.faceTimer) {
          this.faceIndex = 3
          clearInterval(this.faceTimer)
          this.faceTimer = null
        }
      } else {
        if (this.faceTimer) return
        this.faceTimer = setInterval(() => {
          if (this.faceIndex === 1) {
            this.faceSuccess = true
            this.$refs.thisVideo.pause()
            clearInterval(this.faceTimer)
            this.faceIndex = 1
          } else {
            this.faceIndex--
          }
        }, 1000)
      }
    },
    initUserMedia () {
      const message = browser().weixin
        ? '您的微信版本/系统版本无法满足此量表测试。建议您在商店中升级微信版本或者升级系统版本并退出重新进入网页，也可以购买后下载云愈心理App测试～'
        : `打开${this.aiEvalCamEnabled ? '摄像头或麦克风' : '麦克风'}失败，您无法在当前网页测试此量表，您可以下载云愈心理App进行测试～`
      try {
        // 使用前置摄像头
        navigator.mediaDevices.getUserMedia(this.userMediaOptions)
          .then(stream => this.initFirst(stream))
          .catch(err => {
            console.log(`错误:${err}`)
            if (mediaErrorTypes(err.name) === '用户已禁止网页调用摄像头或麦克风设备') {
              this.thisDialog('您已禁止调用摄像头或麦克风设备，当前网页无法满足此量表测试。建议您在设置中打开应用权限并退出重新进入网页，也可以下载云愈心理App进行测试～')
            } else {
              this.thisDialog(message)
            }
          })
      } catch (err) {
        this.thisDialog(message)
        console.log(err)
      }
    },
    initFirst (stream) {
      window.yunyuStream = stream
      /******************************
       *      音视频控件初始化
       *****************************/
      console.log('Media stream created.')
      this.recorder = new Recorder({ stream: stream })
      this.recorder.start()
      console.log('录音初始化。。。')
      /******************************
       *          监听录音
       *****************************/
      this.recorder.process.onaudioprocess = (e) => {
        const buffer = e.inputBuffer.getChannelData(0)
        this.recorder.audioBuffers.push(new Float32Array(buffer))
        const samples = this.compress([new Float32Array(buffer)])
        const db = this.getDB(samples)
        this.db = db > 0 ? db : 0
        console.log('录音中。。。')
      }
      this.getTimer()
      if (!this.aiEvalCamEnabled) return
      this.mediaRecorder = new MediaRecorder(stream)
      this.mediaRecorder.start()
      this.$refs.thisVideo.videoBox.srcObject = stream
      this.$refs.thisVideo.play()
      console.log('录像初始化。。。')

      /******************************
       *          监听录像
       *****************************/
      this.mediaRecorder.onstart = e => {
        console.log(e, '开始录像。。。')
      }
      this.mediaRecorder.onstop = e => {
        console.log(e, '停止录像。。。', this.videoChunk)
      }
      this.mediaRecorder.ondataavailable = e => {
        console.log('视频生成。。。', e.data)
      }
    },
    getTimer () {
      this.timer = setInterval(() => {
        if (this.db > 40) {
          this.volumeWarn = true
        } else {
          this.volumeWarn = false
        }
      }, 100)
    },
    compress (inputData) {
      let size = 0
      for (let i = 0; i < inputData.length; i++) {
        size += inputData[i].length
      }
      var data = new Float32Array(size)
      var offset = 0
      for (var i = 0; i < inputData.length; i++) {
        data.set(inputData[i], offset)
        offset += inputData[i].length
      }
      return data
    },
    floatTo16BitPCM (output, offset, input) {
      for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]))
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
      }
    },
    getDB (samples) {
      // const bitDepth = 16
      // const bytesPerSample = bitDepth / 8
      const offset = 0
      const buffer = new ArrayBuffer(samples.length * 2)
      const view = new DataView(buffer)
      this.floatTo16BitPCM(view, offset, samples)

      const int16Audio = new Int16Array(buffer)

      let avgEnergy = 0
      int16Audio.forEach(fragment => {
        avgEnergy += fragment * fragment
      })

      avgEnergy = Math.sqrt(avgEnergy / int16Audio.length)
      // const db = 20 * Math.log10(avgEnergy / 32767)
      const db = 20 * Math.log10(avgEnergy)
      return parseInt(db)
    },
    start () {
      const path = this.$route.query.tableCode === 'FADI' ? '/test-do-fadi' : '/test-do-other'
      this.$router.replace({
        path,
        query: this.$route.query
      })
    },
    thisDialog (message) {
      Dialog.confirm({
        message,
        theme: 'round-button',
        className: 'dialog-confirm',
        confirmButtonText: '我知道了',
        confirmButtonColor: '#fff',
        cancelButtonText: '下载App',
        cancelButtonColor: '#34B7B9'
      }).then(() => {
        const backPath = sessionStorage.getItem('backPath')
        if (backPath === 'bind') {
          sessionStorage.removeItem('backPath')
          this.$router.replace('/my-bind')
        } else {
          const mark = sessionStorage.getItem('setMark')
          if (mark === 'jigoupay') {
            sessionStorage.removeItem('setMark')
            this.$router.replace('/my-record?type=2')
          } else {
            sessionStorage.removeItem('setMark')
            this.$router.replace('/my-record?type=1')
          }
        }
      }).catch(() => {
        this.$router.replace('/my-contact')
      })
    }
  }
}
</script>

<style lang="less">
.dialog-confirm {
  .van-dialog__message {
    font-size: 0.4266667rem;
    font-weight: 700;
    color: #000000;
  }
  .van-dialog__confirm {
    color: #34b7b9 !important;
    border-radius: 999px;
    border:1px solid #34b7b9 !important;
  }
  .van-dialog__cancel {
    border-radius: 999px;
    margin-left: 20px;
  }
  // .van-dialog__confirm {
  //   border-radius: 999px;
  //   margin-right: 20px;
  // }
  .van-dialog__footer {
    padding: 8px 50px 40px;
    flex-direction: row-reverse;
  }
}
</style>
<style lang="less" scoped>
@w: 37.5;
.test {
  min-height: 100vh;
  background-color: #F6F6F6;
  padding: 16px 20px;
  font-size: 14rem / @w;
  box-sizing: border-box;
  p {
    margin-top: 0;
    margin-bottom: 0;
  }
  .test-wrap {
    background-color: #fff;
    min-height: calc(100vh - 3rem);
    border-radius: 10px;
    padding: 16px 12px;
    box-sizing: border-box;
  }
  .icon {
    color: #DDD;
  }
  .title {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #333333;
    // margin: 0;
    img {
      margin-left: 12rem / @w;
    }
  }
  .subtitle {
    // margin-bottom: 1.5vh;
    height: 38rem / @w;
    line-height: 38rem / @w;
    text-align: left;
  }
  .tips {
    height: 86rem / @w;
    margin: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    color: #BBB;
    text-align: center;
    &.first {
      align-items: flex-start;
      line-height: 80rem / @w;
    }
    b {
      position: relative;
      width: 80rem / @w;
      height: 80rem / @w;
      box-shadow: 0px 4px 8px 1px rgba(0, 0, 0, 0.16);
      display: inline-block;
      line-height: 80rem / @w;
      font-size: 36rem / @w;
      border-radius: 50%;
      margin-right: 8px;
      text-align: center;
      &::after {
        content: "分贝";
        position: absolute;
        right: -1rem;
        bottom: -40%;
        font-size: 14px;
        font-weight: normal;
        color: #BBB;
      }
    }
  }
}
.hidden {
  visibility: hidden;
}
.test-error {
  color: #FFB56B;
}
.test-success {
  color:#34B7B9;
}
</style>
