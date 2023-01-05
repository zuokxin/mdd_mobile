<template>
  <div class="test-do-other">
    <div class="in-set" v-if="timeOver">
    <!-- 进度条 -->
      <div class="progress-bar">
        <div class="title">测试进度：{{questionData.proDisplay}}</div>
        <!-- <van-progress :percentage="questionData.progress + 20" stroke-width="5px" color="#34B7B9"  :show-pivot="false" /> -->
        <van-progress :percentage="toPoint(questionData.proDisplay , tableCode === 'MINI'? 'MINI' : '')" stroke-width="5px" color="#34B7B9"  :show-pivot="false" />
      </div>
      <!-- 题目这块 -->
      <div class="question-box-update" v-if= "tableCode === 'MINI' && questionData.miniQInfo.type !== 'audioYN' && questionData.miniQInfo.type !== 'audio'">
        <div class="top">
          <div class="question-topic">{{questionData.topic}}</div>
          <div class="question-text question-mini">{{questionData.title}}</div>
          <miniBox ref="minibox" v-if="tableCode === 'MINI'" @sendFalse="sendFalse" @sendData="sendData" :miniQInfo="questionData.miniQInfo"  :mid="questionData.id"></miniBox>
        </div>
        <div class="under">
          <van-button round block type="primary" :disabled="miniNextFlag" @click="postAnswer">下一题</van-button>
          <!-- <van-button round block type="primary" :disabled="miniNextFlag" @click="sendMini">下一题</van-button> -->
        </div>
      </div>
      <!-- 题目这块 -->
      <div class="question-box" v-else>
        <div class="question-topic" v-if= "tableCode === 'MINI'">{{questionData.topic}}</div>
        <div class="question-text" :class="{'question-mini': tableCode === 'MINI'}">{{questionData.title}}</div>
        <div class="question-textyn" v-if= "tableCode === 'MINI' && questionData.miniQInfo.type === 'audioYN'">(请回答 "是" 或 "不是")</div>
        <p class="question-intro" v-if="tableCode === 'MINI' && questionData.miniQInfo.intro">{{questionData.miniQInfo.intro}}</p>
        <!-- 底部提交按钮 -->
        <div class="under-btn">
          <div class="line"></div>
          <div class="answer-title" v-if="!textFlag">请说话，我在听...</div>
          <div class="answer-title" v-if="textFlag">识别中...</div>
          <div class="answer-tip" v-if="!waitwait">点击下方 停止回答</div>
          <div class="answer-tip" v-if="waitwait"> </div>
          <van-button type="primary" @click="testpost" v-if="false">stop</van-button>
          <div class="btns">
            <div class="left same">
              <span v-for="(it, index) in voice" :key="it" :class="{active: left_Voice[index]}"></span>
            </div>
            <div class="center same">
              <img @click="postAnswer" v-if="!textFlag" src="@/assets/img/stop.png" alt="">
              <img @click="postAnswer" v-if="textFlag" src="@/assets/img/wait.png" alt="">
            </div>
            <div class="right same">
              <span v-for="(it, index) in voice" :key="it" :class="{active: right_Voice[index]}"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 人脸 -->
    <div class="face-box" v-show="timeOver && aiEvalCamEnabled && readOver" ref="point" :style="`width:${divWidth}px;height:${divHeight}px;left:${moveLeft}px;top:${moveTop}px;`"
      @touchstart.prevent="(e)=>{dragStart(e)}" @touchend.prevent="(e)=>{dragEnd(e)}"  @touchmove.prevent="(e) => dragMove(e)">
      <video ref="videoBox" webkit-playsinline="true" playsinline="true"  @loadedmetadata="start"  src="" style="width: 100%; height:100%; object-fit: cover" muted></video>
      <!-- <video ref="videoBox"  style="width: 100%; height:100%; object-fit: cover" muted></video> -->
    </div>
    <!-- 一开始播报弹窗 -->
    <popout :countTime="countTime" :popoutShow="popoutShow" @close="close"></popout>
    <!-- 每一题的语音播报弹窗 -->
    <voice :voicePopout="voicePopout" @voiceClose="voiceClose" ref="voice">
    <template slot="text">
      <div class="text">{{questionData.title}}</div>
    </template>
    </voice>
    <!-- 错误提示的弹窗 -->
    <errpopout class="errpopout" :errPopout="errPopout">
      <template slot="text">
        <div class="text">未听到您的回答，请重新回答题目</div>
      </template>
      <template slot="btn">
        <van-button class="sure-btn" type="primary" @click="sureToAnswer">确定</van-button>
      </template>
    </errpopout>
    <!-- mini没有回答是否 -->
    <errpopout class="errpopout" :errPopout="yesNoMiniDialogFlag">
      <template slot="text">
        <div class="text">无法识别您的回答，请重新作答</div>
        <div class="yellow-text">注意！请回答“是”或“不是”</div>
      </template>
      <template slot="btn">
        <van-button class="sure-btn" type="primary" @click="sureToAnswer">确定</van-button>
      </template>
    </errpopout>
    <!-- 无人脸 -->
     <errpopout class="errpopout" :errPopout="noFace">
      <template slot="text">
        <div class="text">未识别到全部人脸，请重做本题</div>
      </template>
      <template slot="btn">
        <van-button class="sure-btn" type="primary" @click="getFace">确定</van-button>
      </template>
    </errpopout>
  </div>
</template>

<script>
import Recorder from '@/utils/media/recorder'
import * as faceapi from 'face-api.js'
// import Recorder from 'js-audio-recorder'
import { uploader } from '@/utils/uploader'
import miniBox from '@/components/miniChoice.vue'
import { getTableQues, batchInfo, posTableQues, postTableRes } from '@/api/modules/user'
import popout from './popout'
import errpopout from './errpopout'
import voice from './voice'
import { mapGetters } from 'vuex'
import { Dialog } from 'vant'
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
  name: 'do-other',
  components: {
    popout,
    errpopout,
    voice,
    miniBox
  },
  data () {
    return {
      moveLeft: 0, // 左边界&drop
      moveTop: 0, // 上边界&drop
      divWidth: 92,
      divHeight: 92,
      voice: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // dom元素
      left_Voice: [],
      right_Voice: [],
      sessionId: '', // sessionId
      tableCode: '', // tableCode
      timeOver: false,
      countTime: 3, // 3秒倒计时
      popoutShow: false,
      readOver: false,
      questionData: {}, // 当前题目的信息
      copyquestionData: {},
      stream: null, // 流？
      recorder: null, // 录音&下面2个
      audioFiles: [],
      audioFile: null,
      mediaRecorder: null, // 视频&& 下面5个
      videoFiles: [],
      videoFile: null,
      videoSrc: null,
      videoChunk: null,
      canUpload: false,
      onceFlag: false,
      aiEvalCamEnabled: false, // 是否需要开始摄像头的
      voicePopout: false, // 每个题目播报弹窗
      errPopout: false, // 回答有问题的弹窗
      faceFlag: false,
      noFace: false,
      stopFlag: true, // next-question
      error: false, // 设备error
      waitwait: false,
      textFlag: false,
      miniData: '', // mini特殊题型
      miniNextFlag: true,
      miniType: ['check', 'select', 'radio', 'selectRange', 'radioGroup', 'dateRange'],
      yesNoMiniDialogFlag: false, // mini 回答是否的错误弹窗
      getFaceFlag: true
    }
  },
  computed: {
    // 当前表名
    thisTable () {
      return this.$route.query.tableCode
    },
    ...mapGetters([
      'nextTable'
    ]),
    routerPath () {
      // 测试表未完成
      const next = this.nextTable(this.thisTable)
      // console.log(next, '他评')
      if (next) {
        if (next.table.tableType === 1) {
          return `/test-do-self?sessionId=${this.sessionId}&tableCode=${next.tableCode}`
        } else {
          if (next.table.tableCode === 'FADI') {
            return `/test-do-fadi?sessionId=${this.sessionId}&tableCode=${next.tableCode}`
          } else {
            return `/test-do-other?sessionId=${this.sessionId}&tableCode=${next.tableCode}`
          }
        }
      } else {
        return `/test-do-wait?sessionId=${this.sessionId}`
      }
    }
  },
  watch: {
    '$route' (to, from) {
      window.location.reload()
    }
  },
  mounted () {
    // 不能同时弹出多个弹出 弹出弹窗都是重新做题 重新记录== 状态恢复== 除了设备上的错误
    // 弹窗S errPopout noFace（动作waitwait）
    this.sessionId = this.$route.query.sessionId
    this.tableCode = this.$route.query.tableCode
    this.getBatchInfo()
  },
  methods: {
    // 是否需要打开摄像头&&需要做哪些量表的信息
    async getBatchInfo () {
      const res = await batchInfo({ sessionId: this.sessionId })
      // console.log(res)
      if (res.code === 0) {
        this.aiEvalCamEnabled = res.data.aiEvalCamEnabled
        this.initUserMedia()
      }
    },
    // 获取题目
    async init () {
      const data = {
        sessionId: this.sessionId,
        tableCode: this.tableCode
      }
      const res = await getTableQues(data)
      const next = this.nextTable(this.thisTable)
      // console.log(res)
      if (res.code === 0) {
        if (res.data.isEnd) {
          // 获取不到题目了就去等待页
          postTableRes({
            sessionId: this.sessionId,
            tableCode: this.tableCode
          }).then(res => {
            if (res.code === 0) {
              if (next) {
                this.thisDialog('您将进入下一个量表进行测试').then(() => {
                  this.$router.replace(this.routerPath)
                })
              } else {
                this.$router.replace(this.routerPath)
              }
              // this.$router.replace({ path: '/test-do-wait', query: { sessionId: this.sessionId } })
            }
          })
        } else {
          this.stopFlag = true // 获取过题目可以点按钮
          this.timeOver = true
          this.textFlag = false
          this.canUpload = false
          this.audioFiles = []
          this.videoFiles = []
          this.questionData = JSON.parse(JSON.stringify(res.data))
          this.copyquestionData = JSON.parse(JSON.stringify(res.data))
          this.voicePopout = true
          this.$refs.voice.playAudio(this.questionData.qAudioUrl)
          this.getFaceFlag = true
        }
      }
    },
    // 初始化设备
    initDevice (stream) {
      this.recorder = new Recorder({ stream })
      // 按钮边上的音量++
      this.recorder.process.onaudioprocess = (e) => {
        // console.log(e)
        const buffer = e.inputBuffer.getChannelData(0)
        this.recorder.audioBuffers.push(new Float32Array(buffer))
        let maxVal = 0
        buffer.forEach(e => {
          if (maxVal < e) {
            maxVal = e
          }
        })
        if (this.waitwait) {
          this.left_Voice = []
          this.right_Voice = []
        } else {
          this.left_Voice = this.voiceLevel(maxVal * 100).reverse()
          // this.left_Voice = this.voiceLevel(db).reverse()
          this.right_Voice = this.voiceLevel(maxVal * 100)
          // this.right_Voice = this.voiceLevel(db)
        }
        // console.log('录音中。。。', buffer)
      }
      if (this.aiEvalCamEnabled) {
        this.mediaRecorder = new MediaRecorder(stream)
        // this.$refs.videoBox.srcObject = this.stream
      }
    },
    initUserMedia () {
      const mediaObj = { audio: true }
      // 录音是必须的 看情况打开摄像头
      if (this.aiEvalCamEnabled) {
        mediaObj.video = { facingMode: 'user' }
      }
      navigator.mediaDevices.getUserMedia(mediaObj)
        .then(stream => {
          window.yunyuStream = stream
          // 初始化---
          this.stream = stream
          this.popoutShow = true
          this.initDevice(stream)
          // 没问题就开始播报语音
          const countTime = setInterval(() => {
            this.countTime = this.countTime - 1
            if (this.countTime === 0) {
              clearInterval(countTime)
            }
          }, 1000)
        })
        .catch(err => {
          let errType = '摄像头或麦克风调用错误'
          switch (err.name) {
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
          this.error = true
          this.$toast(errType)
        })
    },
    // 倒计时&&固定语音播报结束
    close () {
      this.popoutShow = false
      // 纠结 弹窗之间要不要有间隔时间
      setTimeout(() => { this.init() }, 300)
    },
    // 题目语音播报结束
    voiceClose () {
      this.readOver = true
      this.voicePopout = false
      this.faceFlag = true
      this.waitwait = false
      this.startRecorder()
    },
    // 开始记录语音||开启摄像头---------------
    startRecorder () {
      // audio
      this.recorder.start()
      // video
      if (this.aiEvalCamEnabled) {
        this.$refs.videoBox.srcObject = this.stream
        console.log('录像初始化。。。')
        if (this.mediaRecorder.state !== 'recording') {
          this.mediaRecorder.start()
        }
        this.$refs.videoBox.play()
        /******************************
         *          监听录像
         *****************************/
        this.mediaRecorder.onstart = e => {
          console.log(e, '开始录像。。。')
        }
        this.mediaRecorder.onstop = e => {
          console.log(e, '停止录像。。。', this.videoChunk)
          if (this.canUpload && !this.noFace && this.getFaceFlag) {
            // 视频文件处理
            this.videoFile = this.fileCreate([this.videoChunk], '.mp4', 'video/mp4')
            this.videoFiles.push(this.videoFile)
            // 音频文件处理
            // 上传文件
            this.audioCreate()
            this.postQuesRes()
          }
        }
        this.mediaRecorder.ondataavailable = e => {
          console.log('视频生成。。。')
          this.videoChunk = e.data
        }
      }
    },
    // 音量等级1-10
    voiceLevel (n) {
      // 10 一级
      const list = [
        { min: 0, max: 10 }, { min: 10, max: 20 }, { min: 20, max: 30 }, { min: 30, max: 40 }, { min: 40, max: 50 }, { min: 50, max: 60 }, { min: 60, max: 70 }, { min: 70, max: 80 }, { min: 80, max: 90 }, { min: 90, max: 100 }
      ]
      // const newN = n / 84 * 100
      const arr = []
      list.forEach(e => {
        if (e.min <= Math.round(n)) {
          arr.push(true)
        } else {
          arr.push(false)
        }
      })
      return arr
    },
    // 音频/视频先传qiniu云then提交给后端
    postAnswer () {
      if (this.error) {
        this.$toast.fail('请检查设备后再完成题目')
        return
      }
      this.waitwait = true // 提交有个过程
      this.getFaceFlag = true
      this.textFlag = true
      if (this.stopFlag) {
        // 这个按钮不能疯狂点击
        this.stopFlag = false
        // 看交音频还是交音屏&&视频
        if (this.aiEvalCamEnabled) {
          this.$refs.videoBox.pause()
          this.canUpload = true
          this.mediaRecorder.stop()
          console.log('提交audio,video')
        } else {
          this.recorder.pause(() => {
            this.audioCreate()
            this.postQueResAudio()
          })
        }
      }
    },
    // 音频文件处理
    audioCreate () {
      // this.audioFile = this.recorder.createFile(`抑郁症辅助诊断_${this.queObj.id}_${this.sessionId}`)
      this.audioFile = this.recorder.createFile(`${this.tableCode}_${this.questionData.id}_${this.sessionId}`)
      this.audioFiles.push(this.audioFile)
    },
    videoCreate () {
      this.videoFile = this.fileCreate([this.videoChunk], '.mp4', 'video/mp4')
      this.videoFiles.push(this.videoFile)
    },
    // 创建文件
    fileCreate (blobArr, suffix, type) {
      // const fileName = `抑郁症辅助诊断_${this.queObj.id}_${this.sessionId}`
      const fileName = `${this.tableCode}_${this.questionData.id}_${this.sessionId}`
      const dateNow = Date.now()
      return new File(blobArr, `${fileName}${suffix}`, { type, lastModified: dateNow })
    },
    // 提交mini
    sendData (d) {
      this.miniData = d
      console.log(this.miniData)
      this.miniNextFlag = false
    },
    sendFalse () {
      // 不可以点
      this.miniNextFlag = true
    },
    clearSendData () {
      this.miniData = ''
      this.miniNextFlag = true
    },
    sendMini () {
      // 这儿用不着视频 音频 丢弃
      const data = {
        sessionId: this.sessionId,
        tableCode: this.tableCode,
        miniQInfo: this.miniData,
        id: this.questionData.id,
        title: this.questionData.title,
        topic: this.questionData.topic
      }
      posTableQues(data).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.clearSendData()
          this.init()
        }
      }).catch(err => {
        // 707时间选项非法
        console.log(err)
        if (err.code) {
          this.$toast(err.message)
        }
      })
    },
    // 提交回答-纯音频
    postQueResAudio () {
      const curData = {
        token: this.questionData.qiniuToken,
        customVars: {
          'x:sessionId': this.sessionId,
          'x:tableName': this.tableCode,
          'x:qIndex': this.questionData.id + ''
        }
      }
      // 提交回答
      uploader({ file: this.audioFile, ...curData }).then(audio => {
        console.log(audio)
        // 当你不想说话进行测试的时候填入这个吧
        // data.audio = 'https://s302.fanhantech.com/depression/1463445405206319104/MINI/FhSqHLeTaA3dQqnnzq6Cw10FzgY7.wav'
        // posTableQues(this.postFormat({ video: '', audio: 'https://s302.fanhantech.com/depression/1463445405206319104/MINI/FhSqHLeTaA3dQqnnzq6Cw10FzgY7.wav' })).then(re => {
        posTableQues(this.postFormat({ video: '', audio: audio.url })).then(re => {
          if (re.code === 0) {
            this.init()
            this.clearSendData()
          }
        }).catch(errr => {
          // 没有说话重新回答 弹出错误提示 再点击确定后做题
          if (errr.code === 546) {
            if (!this.noFace) {
              this.errPopout = true
            }
          } else if (errr.code === 547) {
            // 547是 mini回答是否的问题
            if (!this.noFace) {
              this.yesNoMiniDialogFlag = true
            }
          } else {
            if (!this.noFace) {
              this.$toast(errr.message)
            }
            this.sureToAnswer()
          }
        })
      }).catch(err => {
        if (!this.errPopout) {
          this.$toast.fail(`上传失败(${err})`)
        }
        this.sureToAnswer()
      })
    },
    // 提交回答两个
    async postQuesRes () {
      const curData = {
        token: this.questionData.qiniuToken,
        customVars: {
          'x:sessionId': this.sessionId,
          'x:tableName': this.tableCode,
          'x:qIndex': this.questionData.id + ''
        }
      }
      // 上传音频、视频
      Promise.all([
        uploader({ file: this.videoFile, ...curData }),
        uploader({ file: this.audioFile, ...curData })
      ]).then(res => {
        // const [video] = res
        const [video, audio] = res
        // 当你不想说话进行测试的时候填入这个吧
        posTableQues(this.postFormat({ video: video.url, audio: audio.url })).then(re => {
        // posTableQues(this.postFormat({ video: video.url, audio: 'https://s302.fanhantech.com/depression/1463445405206319104/MINI/FhSqHLeTaA3dQqnnzq6Cw10FzgY7.wav' })).then(re => {
          if (re.code === 0) {
            this.init()
            this.clearSendData()
          }
        }).catch(err => {
          if (err.code === 546) {
            // 没有说话重新回答 弹出错误提示 再点击确定后做题
            if (!this.noFace) {
              this.errPopout = true
            }
          } else if (err.code === 547) {
            // 547是 mini回答是否的问题
            if (!this.noFace) {
              this.yesNoMiniDialogFlag = true
            }
          } else {
            if (!this.noFace) {
              this.$toast(err.message)
            }
            // this.$toast(err.message)
            this.sureToAnswer()
          }
        })
      }
      ).catch(
        err => {
          if (!this.errPopout) {
            this.$toast.fail(`上传失败(${err})`)
          }
          this.sureToAnswer()
        }
      )
    },
    // 弹出错误弹窗
    reAnswer () {
      this.voicePopout = true
    },
    // 重新回答不播放语音
    sureToAnswer () {
      // mini
      if (this.yesNoMiniDialogFlag) {
        this.yesNoMiniDialogFlag = false
      }
      // 状态恢复数据清空
      this.audioFiles = []
      this.videoFiles = []
      this.$refs.videoBox.play()
      this.waitwait = false
      this.textFlag = false
      this.stopFlag = true
      this.errPopout = false
      this.recorder.audioBuffers = [] // 丢弃录制的音频&&重新开始录制
      this.recorder.start()
      if (this.aiEvalCamEnabled) {
        // 如果开启摄像头 要活动 并且做人脸识别检查
        this.mediaRecorder.start()
        this.onceFlag = false
        setTimeout(() => { this.onPlay() }, 2000)
      }
    },
    postFormat (urls = {}) {
      const data = {
        sessionId: this.sessionId,
        tableCode: this.tableCode,
        id: this.questionData.id,
        title: this.questionData.title,
        topic: this.questionData.topic,
        ...urls
      }
      // data.audio = 'https://s302.fanhantech.com/depression/1463445405206319104/MINI/FhSqHLeTaA3dQqnnzq6Cw10FzgY7.wav'
      if (this.tableCode === 'MINI' && this.miniType.includes(this.questionData.miniQInfo.type)) {
        data.miniQInfo = this.miniData
        // 非必传
        delete data.audio
      }
      return data
    },
    toPoint (str, tablename) {
      let point = ''
      if (tablename === 'MINI') {
        // mini进度条
        const a = str.split('/')[0] / str.split('/')[1] * 100
        point = a.toFixed(0)
      } else {
        // 其他进度条
        point = str.replace('%', '')
      }
      return point
    },
    // face的功能
    async start () {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models').then(
        () => {
          console.log('ready')
        }
      )
      // 加载了立刻查脸太快---查脸都是1.5秒
      setTimeout(() => { this.onPlay() }, 1500)
    },
    // 检查脸
    onPlay () {
      const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
      const el = this.$refs.videoBox
      if (this.onceFlag || this.voicePopout) {
        return false
      }
      faceapi.detectSingleFace(el, options).then(
        detection => {
          this.onceFlag = true
          console.log(detection)
          if (detection) {
            setTimeout(() => {
              this.onceFlag = false
              this.onPlay()
            }, 2000)
          } else {
            // 无脸弹窗  注意其他弹窗
            if (!this.errPopout && !this.waitwait) {
              this.noFace = true
              if (this.tableCode === 'MINI' && this.miniType.includes(this.questionData.miniQInfo.type)) {
                this.$refs.minibox.clearData()
                this.miniNextFlag = true
              }
            }
            this.$refs.videoBox.pause()
          }
        }
      ).catch(
        err => {
          console.log(err, 'err')
        }
      )
    },
    // 没脸的处理->一些东西重新开始 && 状态恢复
    getFace () {
      // 去找人脸重新录制===状态===
      this.questionData = JSON.parse(JSON.stringify(this.copyquestionData))
      this.noFace = false
      this.$refs.videoBox.play()
      this.getFaceFlag = false
      if (this.aiEvalCamEnabled && !(this.tableCode === 'MINI' && this.miniType.includes(this.questionData.miniQInfo.type))) {
        this.mediaRecorder.stop()
        this.recorder.pause()
      }
      this.sureToAnswer()
      // setTimeout(() => { this.onPlay() }, 1500)
    },
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
        const fa = document.getElementsByClassName('test-do-other')[0]
        if (this.moveLeft <= 0) {
          this.moveLeft = 0
        }
        if (this.moveLeft >= fa.clientWidth - 92) {
          this.moveLeft = fa.clientWidth - 92
        }
        this.moveTop = touch.clientY - this.divHeight + 46
        if (this.moveTop <= 0) {
          this.moveTop = 0
        }
        if (this.moveTop >= fa.clientHeight - 92) {
          this.moveTop = fa.clientHeight - 92
        }
      }
    },
    // 弹窗封装
    thisDialog (message) {
      return Dialog.alert({
        message,
        theme: 'round-button',
        className: 'detail-dialog',
        confirmButtonText: '确定',
        confirmButtonColor: '#34B7B9'
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    // 离开后摄像头红点消失
    this.recorder.close()
    if (window.yunyuStream) {
      const [media01, media02] = window.yunyuStream.getTracks()
      if (media01) media01.stop()
      if (media02) media02.stop()
    }
    next()
  }
}
</script>

<style lang="less" scoped>
.test-do-other{
  width: 100%;
  z-index: 1;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #F4F4F4;
  .in-set{
    margin: 0 .5405rem;
    box-sizing: border-box;
    height: 100%;
    overflow: hidden;
    .progress-bar{
      height: 1.6757rem;
      padding: .4324rem .3243rem 0;
      box-sizing: border-box;
      .title{
        text-align: center;
        font-size: 12px;
        height: 12px;
        line-height: 12px;
        margin-bottom: .2703rem;
      }
    }
  }
  // 正常的
  .question-box{
    position: relative;
    overflow: hidden;
    height: 100%;
    border-radius: 10px;
    background: #FFFFFF;
    .question-text{
      font-size: .4267rem;
      padding: .4324rem .3243rem;
      color: #333333;
      font-weight: 500;
      line-height: 28px;
    }
    .question-intro{
      font-size: 13px;
      padding: 0 .3243rem;
      color: #999999;
      line-height: 28px;
    }
    .question-topic{
      font-size: .3467rem;
      padding: .4324rem .3243rem 0rem;
      color: #333333;
      font-weight: 500;
      line-height: 28px;
    }
    .question-mini{
      padding-top: .2703rem;
    }
    .question-textyn{
      color: #FFB56B;
      font-size: 14px;
      line-height: 14px;
      padding: 0rem .3243rem ;
    }
    .under-btn{
      background: #FFFFFF;
      width: calc(100% - 1.07rem);
      height: 4.9459rem;
      position: fixed;
      bottom: 0;
      .line{
        margin:  0 .2703rem;
        height: 2px;
        background: #D5D5D5;
      }
      .answer-title{
        text-align: center;
        font-weight: bold;
        font-size: 14px;
        color: #000000;
        margin: .4324rem 0;
      }
      .answer-tip{
        text-align: center;
        height: 16px;
        font-size: 12px;
        font-weight: 500;
        color: #BBBBBB;
      }
      .btns{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: nowrap;
        .same{
          display: flex;
          .active{
            background: #34B7B9;
          }
          span{
            width: .1081rem;
            height: 24px;
            background: #EBEBED;
            border-radius: 2px;
            margin: 0 2px;
          }
        }
        .center{
          img{
            width: 2.1622rem;
            height: 2.1622rem;
          }
        }
      }
    }
  }
  // 不正常的
  .question-box-update{
    height: calc(100% - 1.6757rem);
    position: relative;
    padding-bottom: 2.7027rem;
    box-sizing: border-box;
    .top{
      background: #FFFFFF;
      border-radius: .2703rem;
      box-sizing: border-box;
      overflow-y: auto;
      height: 100%;
      .question-text{
        font-size: 13px;
        padding: .4324rem .3243rem;
        color: #333333;
        line-height: 28px;
      }
      .question-topic{
        font-size: 15px;
        padding: .4324rem .3243rem 0rem;
        color: #333333;
        font-weight: 500;
        line-height: 28px;
      }
      .question-mini{
        padding-top: .2703rem;
      }
    }
    .under{
      height: 2.7027rem;
      position: absolute;
      overflow: hidden;
      padding: 0 .3514rem;
      box-sizing: border-box;
      bottom: 0;
      left: 0;
      width: 100%;
      .van-button{
        margin-top: .4324rem;
      }
      .van-button--disabled{
        background: #D5D5D5;
        border-color: #D5D5D5;
      }
    }
  }
  .face-box{
    position: absolute;
    z-index: 10;
    border-radius: 10px;
    background-color: rgba(255,255,255,.2);
    overflow: hidden;
    filter: blur(2px);
    box-shadow: 0 0 2px #333;
    video{
      mix-blend-mode: screen;
      border-radius: 10px;
    }
  }
  // lots of errors (popout)
  .errpopout{
    /deep/.popout_box{
      padding: 0 1rem;
      margin: 0 0.7027rem;
      text-align: center;
      .text{
        color: #000000;
        margin-top: 1.7027rem;
        font-size: 16px;
        font-weight: 600;
      }
      .yellow-text{
        color: #FFB56B;
        margin-top: .3243rem;
        font-size: 16px;
        font-weight: 600;
      }
      .sure-btn{
        background: #34B7B9;
        width: 2.3243rem;
        height: 1.0811rem;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 1.0811rem;
        border-radius: 20px;
      }
    }
  }
}
</style>
