<template>
  <div class="test">
    <div class="d-inline-block text-center">
      <div v-if="aiEvalCamEnabled">
        <p class="title">
          摄像头测试
        </p>
        <!-- <p class="subtitle" :class="{'test-success': faceSuccess}">
          请打开摄像头，将人脸对准图像框内3S
          <icon-font
            class="ml-2 icon"
            name="#mdd-status"
            :width="18"
            :height="18"
          ></icon-font>
        </p> -->
        <video-box ref="thisVideo" class="d-inline-block" :faceDetection="true" @getFace="getFace" size="150px">
        </video-box>
        <!-- <p v-if="!faceSuccess && !face" class="subtitle test-error">未识别到人脸，可能是光线较暗或人脸不在图像框内</p>
        <p v-else class="font-weight-bold test-success">{{ faceIndex }}s</p>
        <p class="subtitle" style="max-width: 33 * var(--vh);">请在接下来的答题过程中也保持人脸在图像框内，否则需要重新答题</p> -->
      </div>
      <p class="title" :style="{marginTop: 'calc(5 * var(--vh))'}">
        语音测试
      </p>
      <!-- <p class="subtitle" :class="{'test-success': !volumeWarn}">
        请保证周围环境噪音不高于40分贝
        <icon-font
          class="ml-2 icon"
          name="#mdd-status"
          :width="18"
          :height="18"
        ></icon-font>
      </p> -->
      <p class="tips text-center">
        <b :style="{ color: volumeColor }">{{ db > 0 ? db : 0 }}</b>
        <span class="ml-2">分贝</span>
      </p>
      <!-- <p class="subtitle test-error" :class="{ 'hidden': !volumeWarn || db <= 40 }">当前噪音过大！</p> -->
      <p v-if="mediaError">信息：{{ mediaError }}</p>
      <van-button v-show="status && init" type="primary" @click="close">暂停</van-button>
      <van-button v-show="!status && init" type="primary" @click="start">开始</van-button>
      <div v-show="href">下载视频:<a :href="href">open</a></div>
      <van-button v-show="!init" type="primary" @click="startMedia">开始</van-button>
    </div>
    <!-- <el-button class="main-btn-dark mt-4" :disabled="canStart" @click="toNext">开始测试</el-button> -->
  </div>
</template>

<script>
// @ is an alias to /src
import VideoBox from './VideoBox'
// import { mediaErrorTypes } from '@/utils/types'
// import { testMiXin } from '@/mixin/test-do'
import Recorder from '@/utils/media/recorder'
// import adapter from 'webrtc-adapter'
export default {
  name: 'ToolsTest',
  // mixins: [testMiXin],
  components: {
    VideoBox
  },
  data () {
    return {
      stream: null,
      init: false,
      status: 1,
      href: '',
      recorder: null,
      mediaRecorder: null,
      mediaError: '',
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
    volumeColor () {
      return this.db > 40 ? '#FFB183' : '#0CB000'
    },
    aiEvalCamEnabled () {
      return true
    },
    canStart () {
      if (!this.aiEvalCamEnabled) {
        return this.volumeWarn
      }
      return !this.faceSuccess || this.volumeWarn
    }
  },
  watch: {
    face (n) {
      if (this.faceSuccess) return
      if (n) {
        this.faceIndex = 1
        this.faceTimer = setInterval(() => {
          if (this.faceIndex === 3) {
            this.faceSuccess = true
            this.$refs.thisVideo.pause()
            clearInterval(this.faceTimer)
          } else {
            this.faceIndex++
          }
        }, 1000)
      } else {
        this.faceSuccess = false
        if (this.faceTimer) clearInterval(this.faceTimer)
      }
    }
  },
  mounted () {
    // window.URL = window.URL || window.webkitURL
    // window.AudioContext = window.AudioContext || window.webkitAudioContext
    // if (navigator.mediaDevices === undefined) {
    //   navigator.mediaDevices = {}
    // }
    // if (navigator.mediaDevices.getUserMedia === undefined) {
    //   navigator.mediaDevices.getUserMedia = constraints => {
    //     const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia
    //     if (!getUserMedia) {
    //       return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
    //     }
    //     return new Promise((resolve, reject) => {
    //       getUserMedia.call(navigator, constraints, resolve, reject)
    //     })
    //   }
    // }
    // const browserDetails = adapter.browserDetails
    // adapter.browserShim.shimGetDisplayMedia(window, browserDetails)
    // adapter.browserShim.shimGetUserMedia(window, browserDetails)
    // console.log(adapter)
    this.initUserMedia()
    // const mediaObj = { audio: true }
    // if (this.aiEvalCamEnabled) mediaObj.video = { facingMode: 'user' }
    // navigator.mediaDevices.getUserMedia(mediaObj).then(stream => {
    //   window.yunyuStream01 = stream
    //   if (this.aiEvalCamEnabled) this.$refs.thisVideo.setVideoSrc(stream)
    //   this.audioctx = new AudioContext()
    //   this.audioinput = this.audioctx.createMediaStreamSource(stream)
    //   this.scriptNode = this.audioctx.createScriptProcessor(
    //     4096, 1, 1
    //   )
    //   this.audioinput.connect(this.audioctx.createGain())
    //   this.audioinput.connect(this.scriptNode)
    //   this.scriptNode.connect(this.audioctx.destination)
    //   // 监听录音的过程
    //   this.scriptNode.onaudioprocess = event => {
    //     const buffer = event.inputBuffer.getChannelData(0)
    //     const samples = this.compress([new Float32Array(buffer)])
    //     const db = this.getDB(samples)
    //     this.db = db
    //     // this.dbArray.push(db)
    //   }
    //   this.getTimer()
    // }).catch(
    //   err => {
    //     console.log(`错误:${err}`)
    //     this.mediaError = this.mediaErrorTypes(err.name)
    //     // this.$message({
    //     //   type: 'error',
    //     //   message: this.mediaErrorTypes(err.name)
    //     // })
    //   }
    // )
  },
  beforeDestroy () {
    this.audioctx.close().then(() => { console.log('close') })
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    startMedia () {
      if (this.mediaError) {
        alert('不支持摄像头或麦克风功能')
        return
      }
      this.init = true
      this.initFirst(this.stream)
    },
    initUserMedia () {
      // 使用前置摄像头
      const mediaObj = { audio: true }
      if (this.aiEvalCamEnabled !== -1) mediaObj.video = { facingMode: 'user', width: 1280, height: 720 }
      navigator.mediaDevices.getUserMedia(mediaObj)
        .then(stream => this.startUserMedia(stream))
        .catch(err => {
          console.log(`错误:${err}`)
          this.mediaError = `
            提示：${this.mediaErrorTypes(err.name)}
            错误信息:${err}`
        })
    },
    startUserMedia (stream) {
      this.stream = stream
    },
    initFirst (stream) {
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

      if (this.aiEvalCamEnabled !== -1) {
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
          // 视频文件处理
          // this.videoFile = this.fileCreate([this.videoChunk], '.mp4', 'video/mp4')
          // this.videoFiles.push(this.videoFile)
          // // 音频文件处理
          // this.audioCreate()
          // // 上传文件
          // this.postQueRes()
        }
        this.mediaRecorder.ondataavailable = e => {
          console.log('视频生成。。。', e.data)
          this.href = URL.createObjectURL(e.data)
        }
      }
    },
    // videoOpen () {
    //   this.videoIsOpen = true
    //   this.$refs.thisVideo.play()
    // },
    getFace (e) {
      this.face = e
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
    toNext () {
      this.$router.replace({
        path: `/test/do-others?name=${this.$route.query.name}`
      })
    },
    mediaErrorTypes (name) {
      let errType = '摄像头或麦克风调用错误'
      switch (name) {
        case 'NotAllowedError':
        case 'PermissionDeniedError':
          errType = '用户已禁止网页调用摄像头或麦克风设备'
          break
        case 'NotFoundError':
        case 'DevicesNotFoundError':
          errType = '摄像头或麦克风设备未找到'
          break
        case 'NotSupportedError':
          errType = '不支持摄像头或麦克风功能'
          break
      }
      return errType
    },
    close () {
      this.status = 0
      this.mediaRecorder.stop()
      this.$refs.thisVideo.pause()
      this.recorder.pause()
    },
    start () {
      this.status = 1
      this.href = ''
      this.mediaRecorder.start()
      this.$refs.thisVideo.play()
      this.recorder.start()
    }
  }
}
</script>

<style lang="less" scoped>
.test {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .icon {
    color: #DDD;
  }

  .title {
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    font-weight: 700;
    color: #666;
  }

  .subtitle {
    margin-bottom: calc(1.5 * var(--vh));
    font-size: 14px;
    text-align: left;
  }

  .tips {
    color: #BBB;

    b {
      display: inline-block;
      // width: 1.5em;
      height: 36px;
      line-height: 1;
      text-align: right;
      font-size: 36px;
    }
  }
}

.hidden {
  visibility: hidden;
}

.test-error {
  color: #FF0000;

  .icon {
    color: #FF0000;
  }
}

.test-success {
  color: #00CE00;

  .icon {
    color: #00CE00;
  }
}</style>
