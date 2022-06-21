<template>
  <div class="test">
    <div class="test-wrap">
      <div>
        <p class="title">
          摄像头测试
        </p>
        <p>请将人脸放置在图像框内</p>
        <video-box
          ref="thisVideo"
          size="172px"
          :icon="true"
          style="margin: 0 auto"
        >
        </video-box>
      </div>
      <p class="title" style="margin-top: 5vh">
        语音测试
      </p>
      <p>进行环境语音检测</p>
      <p class="tips text-center">
        <b :style="{ color: '#0CB000' }">{{ db > 0 ? db : 0 }}</b>
        <span style="margin-left: 10px">分贝</span>
      </p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import VideoBox from '@/components/VideoBox'
import { mediaErrorTypes } from '@/utils/types'
import Recorder from '@/utils/media/recorder'
// import adapter from 'webrtc-adapter'
import { Dialog } from 'vant'
export default {
  name: 'ToolsTest',
  beforeRouteLeave (to, from, next) {
    // 离开后摄像头红点消失
    if (window.yunyuStream) {
      const [media01, media02] = window.yunyuStream.getTracks()
      if (media01) media01.stop()
      if (media02) media02.stop()
    }
    next()
  },
  components: {
    VideoBox
  },
  data () {
    return {
      stream: null,
      init: false,
      status: 1,
      recorder: null,
      mediaRecorder: null,
      db: 0,
      // dbArray: [],
      volumeWarn: true,
      timer: null,
      face: false,
      faceSuccess: false,
      faceTimer: null,
      faceIndex: 0
    }
  },
  computed: {
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
    this.initUserMedia()
  },
  beforeDestroy () {
    if (this.recorder) this.recorder.close()
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    initUserMedia () {
      try {
        // 使用前置摄像头
        navigator.mediaDevices.getUserMedia({ audio: true, video: { facingMode: 'user' } })
          .then(stream => this.initFirst(stream))
          .catch(err => {
            console.log(`错误:${err}`)
            if (mediaErrorTypes(err.name) === '用户已禁止网页调用摄像头或麦克风设备') {
              this.thisDialog('您已禁止调用摄像头或麦克风设备，当前网页无法满足此量表测试。建议您在设置中打开应用权限并退出重新进入网页，也可以购买后下载云愈心理App测试～')
            } else {
              this.thisDialog('打开摄像头失败，您无法在当前网页测试此量表，您可以购买后在云愈心理App内进行测试，是否继续购买？')
            }
          })
      } catch (err) {
        this.thisDialog('打开摄像头失败，您无法在当前网页测试此量表，您可以购买后在云愈心理App内进行测试，是否继续购买？')
        console.log(err)
      }
    },
    startUserMedia (stream) {
      this.stream = stream
    },
    initFirst (stream) {
      window.yunyuStream = stream
      this.thisDialog('您当前的设备支持测试此量表，继续购买吧～')
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
        this.db = db
        console.log('录音中。。。')
      }
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
      let index = 0
      this.timer = setInterval(() => {
        if (this.db > 40) {
          index = 0
        } else {
          index++
          if (index > 30) {
            this.volumeWarn = false
            clearInterval(this.timer)
          }
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
      const db = 20 * Math.log10(avgEnergy)
      return parseInt(db)
    },
    thisDialog (message) {
      Dialog.alert({
        message,
        theme: 'round-button',
        className: 'detail-dialog',
        confirmButtonText: '确定',
        confirmButtonColor: '#34B7B9'
      }).then(() => {
        this.$router.go(-1)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.test {
  min-height: 100vh;
  background-color: #F6F6F6;
  padding: 16px 20px;
  .test-wrap {
    background-color: #fff;
    min-height: 90vh;
    border-radius: 10px;
    padding: 16px 12px;
  }
  .icon {
    color: #DDD;
  }
  .title {
    font-size: 14px;
    font-weight: 600;
    color: #333333;
    margin: 0;
  }
  .tips {
    color: #BBB;
    text-align: center;
    b {
      width: 80px;
      height: 80px;
      box-shadow: 0px 4px 8px 1px rgba(0, 0, 0, 0.16);
      display: inline-block;
      line-height: 80px;
      font-size: 36px;
      border-radius: 50%;
    }
  }
}
.hidden {
  visibility: hidden;
}
</style>
