<template>
  <div id="tableFadi" class="ques-counselling">
    <div class="ques-counselling-wrap">
      <div class="top">
        <img src="@/assets/img/test/lamp.png" alt="lamp" height="18">
        <span>小愈是智能虚拟人物，可以辅助评估你的心理状态。</span>
      </div>
      <div class="main" ref="mainIn">
        <div class="main-in">
          <div v-if="historRecods.length > 0">
            <div v-for="item in historRecods" :key="item.index">
              <DialogBoxLeft :textLeft="item.title" :isHistory="true"></DialogBoxLeft>
              <DialogBoxRight :textRight="item.audioDuration"></DialogBoxRight>
            </div>
          </div>
          <div v-for="(record, index) in chatRecords" :key="record + index">
            <!-- :needAnswer="record.needAnswer" -->
            <DialogBoxLeft :ref="'DialogBoxLeft' + index" v-if="record.component === 'left' && record.status === false"
              :url="record.url" :textLeft="record.text" @playVideo="e => playVideo(e, index)"
              @openStartPrompt="openStartPrompt"></DialogBoxLeft>
            <DialogBoxRight v-if="record.component === 'right'" :textRight="record.audioDuration"></DialogBoxRight>
          </div>
          <div v-show="queLoading" style="margin-left: 26px;">
            <img src="@/assets/img/test/wait.gif" alt="wait" width="60">
          </div>
        </div>
      </div>
      <div v-show="recorderShow" class="bottom" :class="{ 'isEnd': isEnd }">
        <div v-if="!isEnd" class="bot_box">
          <p class="tips-01">{{ btnText }}</p>
          <p class="tips-02">{{ btnText2 }}</p>
          <div class="submit-btn">
            <VolumeIcon class="mr-3" v-show="!loading" :value="volumeVal" style="transform: rotateZ(180deg);">
            </VolumeIcon>
            <XyButton :disabled="loading || !btnShow" @click.native="toNext()"></XyButton>
            <VolumeIcon class="ml-3" v-show="!loading" :value="volumeVal" style="margin-bottom: -5px;"></VolumeIcon>
          </div>
        </div>
        <van-button v-if="isEnd" class="main-btn-dark mx-auto my-5" type="primary" size="large" round block
          :disabled="finishBtnDisable" @click="submit" style="width: 76.8%;">
          完成
        </van-button>
      </div>
      <!-- <div v-show="!recorderShow" class="bottom" style="background-color: #F4F4F4;"></div> -->
    </div>
    <!-- 人脸 -->
    <DragVideo v-if="aiEvalCamEnabled" ref="dragVideo" @getFace="getFace" :location="{ right: 10, top: 50 }">
    </DragVideo>
    <!-- 开始提示 -->
    <van-dialog v-model="startShow" theme="round-button" className="detail-dialog" confirmButtonText="好的"
      confirmButtonColor="#34B7B9" @close="colseStartTips">
      <div class="fadi-start-box">
        <p class="title">测试即将开始</p>
        <p class="content">
          <van-icon name="info" color="#EB5940" style="margin-left: -1.1em" />
          部分手机自带浏览器可能无法正常播放视频画面，您可以尝试切换浏览器测评
        </p>
      </div>
    </van-dialog>
    <!-- 弹窗提示 -->
    <van-dialog v-if="aiEvalCamEnabled" v-model="faceShow" message="未识别到全部人脸，请重做本题" theme="round-button"
      className="detail-dialog" confirmButtonText="确定" confirmButtonColor="#34B7B9" @close="colseFaceTips"></van-dialog>
  </div>
</template>

<script>
import DialogBoxLeft from './dialog-box-left'
import DialogBoxRight from './dialog-box-right'
import XyButton from './xy-button'
import VolumeIcon from './volume-icon'
import DragVideo from '@/components/DragVideo'
import { Notify, Dialog } from 'vant'
import { getTableQues, batchInfo, posTableQues, postTableRes } from '@/api/modules/user'
import { uploader } from '@/utils/uploader'
// import { encodeWav } from '@/utils/media/audio'
import { mediaErrorTypes } from '@/utils/types'
// import { throttle } from '@/utils/throttle'
import Recorder from '@/utils/media/recorder'
// import { mapGetters } from 'vuex'
import { testMiXin } from '@/mixin/test-mixin'
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
  name: 'test-do-fadi',
  mixins: [testMiXin],
  components: {
    DialogBoxLeft,
    DialogBoxRight,
    XyButton,
    VolumeIcon,
    DragVideo
  },
  data () {
    return {
      qVideoUrl: '',
      startShow: false,
      faceShow: false,
      canFace: false, // 可以进行人脸识别
      chatRecords: [],
      historRecods: [],
      // textRight: '',
      volumeVal: 0,
      queLoading: false,
      midwayBackBool: true, // true代表着中途返回
      error: true,
      audioFiles: [],
      audioUrls: [],
      videoFiles: [],
      videoUrls: [],
      mediaRecorder: null,
      recorderShow: false,
      token: '',
      timer: null,
      isEnd: false,
      queObj: {},
      videoFile: null,
      audioFile: null,
      loading: false,
      init: true,
      finishBtnDisable: true,
      lastTime: 0,
      audioDuration: 0, // 音频时长，类型为int，单位是秒
      videoPlayer: null, // 摄像头对象
      faceTimer: null, // 人脸识别计时器
      canUpload: false,
      aiEvalCamEnabled: false,
      btnShow: false
    }
  },
  computed: {
    sessionId () {
      return this.$route.query.sessionId
    },
    tableCode () {
      return this.$route.query.tableCode
    },
    btnText () {
      return this.loading ? '识别中...' : '请说话，我在听...'
    },
    btnText2 () {
      return this.loading ? '正在提交测试结果，请勿关闭或刷新页面' : '点击下方，停止说话'
    }
    // // 当前表名
    // thisTable () {
    //   return this.$route.query.tableCode
    // }
    // ...mapGetters([
    //   'nextTable'
    // ]),
    // routerPath () {
    //   // 测试表未完成
    //   const next = this.nextTable(this.thisTable)
    //   if (next) {
    //     if (next.table.tableType === 1) {
    //       return `/test-do-self?sessionId=${this.sessionId}&tableCode=${next.tableCode}`
    //     } else {
    //       return `/test-do-other?sessionId=${this.sessionId}&tableCode=${next.tableCode}`
    //     }
    //   } else {
    //     return `/test-do-wait?sessionId=${this.sessionId}&s=60`
    //   }
    // }
  },
  created () {
    console.log('Android')
    this.getBatchInfo()
  },
  methods: {
    /******************************************
     * 人脸识别
    *******************************************/
    // 监听人脸识别
    getFace (e) {
      const clear = () => {
        if (this.faceTimer) {
          clearInterval(this.faceTimer)
          this.faceTimer = null
        }
      }
      // 答题结束不再检测（当前流程待确认此行代码是否可删除）
      if (this.isEnd) return
      if (!this.canFace) return clear()
      // if (!this.canUpload) {
      //   // console.log('不能上传了-有弹窗被开启了')
      //   return
      // }
      // if (this.loading) {
      //   // console.log('不能检测了-在提交答案')
      //   return
      // }
      // console.log('开始检测')
      if (!e) {
        // console.log('检测到')
        // 未检出人脸1S
        if (this.faceTimer) return
        this.unFaceTime = (new Date()).getTime()
        this.faceTimer = setInterval(() => {
          const newTime = (new Date()).getTime()
          if (newTime - this.unFaceTime >= 1000) {
            // console.log('间隔1s', newTime, this.unFaceTime)
            this.openFacrTips()
            clear()
          }
        }, 1)
      } else {
        // console.log('未检测到')
        clear()
      }
    },
    // 打开人脸提示
    openFacrTips () {
      // 提交时禁止进入，防止出现两个弹窗
      if (!this.canFace) return
      // 不上传标志位后再暂停录制
      this.canFace = false
      this.canUpload = false
      this.recorderShow = false
      this.btnShow = false
      this.$refs.dragVideo.pauseVideo()
      this.mediaRecorder.stop()
      this.recorder.pause(() => {
        this.faceShow = true
      })
    },
    // 关闭人脸提示
    colseFaceTips () {
      this.handleDialog()
    },
    // 弹窗逻辑处理（人脸识别和无答案）
    handleDialog () {
      // 重新读题
      const lastChild = this.chatRecords.pop()
      lastChild.status = false
      this.$nextTick(() => {
        this.chatRecords.push(lastChild)
      })
    },
    /******************************************
     * 媒体设备
    ******************************************/
    // 获取媒体
    initUserMedia () {
      const params = {
        audio: true
      }
      if (this.aiEvalCamEnabled) {
        params.video = { facingMode: 'user', width: 1280, height: 720 }
      }
      // 使用前置摄像头
      navigator.mediaDevices.getUserMedia(params)
        .then(stream => this.startUserMedia(stream))
        .catch(err => {
          this.error = true
          console.log(`错误:${err}`)
          Notify({ type: 'danger', message: mediaErrorTypes(err.name) })
        })
    },
    // 音视频控件初始化
    startUserMedia (stream) {
      window.mediaStream = stream
      this.getCurQue()

      console.log('Media stream created.')
      this.recorder = new Recorder({ stream })
      console.log('录音初始化。。。')
      // if (!this.init) {
      //   this.init = true
      // }

      // 监听录音
      let bufferArray = []
      this.recorder.process.onaudioprocess = e => {
        const buffer = e.inputBuffer.getChannelData(0)
        bufferArray = [...bufferArray, new Float32Array(buffer)]
        console.log('录音中。。。')
        var maxVal = 0
        for (var i = 0; i < buffer.length; i++) {
          if (maxVal < buffer[i]) {
            maxVal = buffer[i]
          }
        }
        // 显示音量值
        this.volumeVal = Math.round(maxVal * 100)
        this.recorder.audioBuffers.push(new Float32Array(buffer))
      }

      // 不开启摄像头
      if (!this.aiEvalCamEnabled) return

      this.$refs.dragVideo.setSteam(stream)
      this.mediaRecorder = new MediaRecorder(stream)
      console.log('录像初始化。。。')
      // 监听录像
      this.mediaRecorder.onstart = e => {
        console.log(e, '开始录像。。。')
      }
      this.videoChunk = null
      this.mediaRecorder.onstop = e => {
        console.log(e, '停止录像。。。')
        // 上传文件
        // 可上传：答题环节，可上传标志位（人脸时标志位不见）
        if (!this.isEnd && this.canUpload) {
          // 视频文件处理
          this.videoCreate()
          // 音频文件处理
          this.audioCreate()
          bufferArray = []
          this.postQueRes()
        } else {
          bufferArray = []
          this.recorder.audioBuffers = []
        }
      }
      this.mediaRecorder.ondataavailable = e => {
        console.log('视频生成。。。')
        this.videoChunk = e.data
      }
    },
    // 是否需要打开摄像头&&需要做哪些量表的信息
    async getBatchInfo () {
      try {
        const res = await batchInfo({ sessionId: this.sessionId })
        this.aiEvalCamEnabled = res.data.aiEvalCamEnabled
        this.initUserMedia()
      } catch (err) {
        console.log(err)
      }
    },
    // 获取题目
    getCurQue () {
      // 加一层返回保护
      if (!this.sessionId || !this.tableCode) return
      this.queLoading = true
      getTableQues({
        sessionId: this.sessionId,
        tableCode: this.tableCode,
        midwayBackBool: this.midwayBackBool,
        virtualPortrait: sessionStorage.fadiGender
      }).then(
        res => {
          this.queLoading = false
          this.midwayBackBool = false
          this.canUpload = false
          const {
            isEnd,
            qiniuToken,
            title,
            qVideoUrl,
            hintsTitle
          } = res.data
          this.isEnd = isEnd
          this.queObj = res.data
          this.token = qiniuToken
          // setTimeout(() => {
          // 判断是否已经完成所有题目
          if (!isEnd) {
            let status = false
            if (hintsTitle && hintsTitle.length > 0) {
              status = true
              hintsTitle.forEach((v, index) => {
                if (index !== hintsTitle.length - 1) {
                  this.historRecods.push({
                    title: v.title,
                    audioDuration: v.audioDuration
                  })
                } else {
                  this.chatRecords.push({
                    component: 'left',
                    text: v.title,
                    url: v.qVideoUrl,
                    status: false
                  })
                }
              })
            }
            if (qVideoUrl) {
              this.chatRecords.push({
                component: 'left',
                text: title,
                url: qVideoUrl,
                status
              })
            }
          } else {
            this.recorderShow = true
            this.finishBtnDisable = false
            if (hintsTitle && hintsTitle.length > 0) {
              hintsTitle.forEach((v, index) => {
                // const timeJson = this.setTime()
                const status = !!index
                this.chatRecords.push({
                  component: 'left',
                  text: v.title,
                  url: v.qVideoUrl,
                  status
                })
              })
            }
          }
          // 让滚动条始终在最底部
          this.$nextTick(() => {
            this.$refs.mainIn.scrollTop = this.$refs.mainIn.scrollHeight
          })
          // }, 1000)
        }
      )
    },
    // 视频播放开始提示用户
    openStartPrompt () {
      this.startShow = true
    },
    // 视频播放初始获取用户点击行为
    colseStartTips () {
      const { setTimer, play } = this.$refs.DialogBoxLeft0[0]
      setTimer()
      play()
      this.startShow = false
    },
    // 音频播放结束
    playVideo (data, index) {
      if (index + 1 !== this.chatRecords.length) {
        // 缓冲下一题
        setTimeout(() => {
          this.chatRecords[index + 1].status = false
          // 让滚动条始终在最底部
          this.$nextTick(() => {
            this.$refs.mainIn.scrollTop = this.$refs.mainIn.scrollHeight
          })
        }, 500)
      } else if (!this.queObj.isNeedAnswer && !this.isEnd) {
        // 无需回答
        this.notAnswer()
      } else {
        // 打开录音
        // if (this.isEnd) {
        //   this.finishBtnDisable = false
        //   return
        // }
        if (this.error) this.error = false
        this.recorder.start()
        if (this.aiEvalCamEnabled) {
          this.mediaRecorder.start()
          this.$refs.dragVideo.restartVideo()
        }
        // 显示录音答题，过1.5S可提交
        this.canFace = true
        this.btnShow = false
        this.recorderShow = true
        this.canUpload = true
        setTimeout(() => {
          this.btnShow = true
        }, 1500)
      }
    },
    // 下一题
    toNext (cb) {
      // 禁用无法进入
      if (this.loading || !this.canUpload || !this.btnShow) return
      if (this.error) {
        Notify({ type: 'warning', message: '请检查设备后再完成题目' })
        return
      }
      if (this.mediaRecorder && this.mediaRecorder.state === 'inactive') {
        return
      }
      if (cb) cb()
      this.canFace = false
      // 是否用摄像头
      if (this.aiEvalCamEnabled) {
        this.$refs.dragVideo.pauseVideo()
        this.mediaRecorder.stop()
        this.recorder.pause()
        // 避免提交过程中摄像头检出
        if (this.faceTimer) {
          clearInterval(this.faceTimer)
          this.faceTimer = null
        }
      } else {
        this.recorder.pause(() => {
          this.audioCreate()
          // 上传文件
          if (!this.isEnd && this.canUpload) {
            this.postQueResAudio()
          } else {
            this.recorder.audioBuffers = []
          }
        })
      }
    },
    // 无须回答
    async notAnswer () {
      // 加一层返回保护
      if (!this.sessionId || !this.tableCode) return
      const data = {
        sessionId: this.sessionId,
        tableCode: this.tableCode,
        ...this.queObj
      }
      await posTableQues(data)
      this.midwayBackBool = false
      this.getCurQue()
    },
    // 提交回答-纯音频
    async postQueResAudio () {
      this.loading = true
      // 加一层返回保护
      if (!this.sessionId || !this.tableCode) return
      const curData = {
        token: this.token,
        customVars: {
          'x:sessionId': this.sessionId,
          'x:tableName': this.tableCode,
          'x:qIndex': this.queObj.id + ''
        }
      }
      try {
        const audio = await uploader({ file: this.audioFile, ...curData })
        try {
          // 加一层返回保护
          if (!this.sessionId || !this.tableCode) return
          // 提交回答
          const queRes = await posTableQues({
            sessionId: this.sessionId,
            tableCode: this.tableCode,
            video: '',
            audio: audio.url,
            audioDuration: this.audioDuration,
            ...this.queObj
          })
          this.loading = false
          // 添加回答
          const answer = queRes.data || ''
          // const timeJson = this.setTime()
          this.chatRecords.push({ component: 'right', text: answer, audioDuration: this.audioDuration })
          this.getCurQue()
          this.recorderShow = false
          // 让滚动条始终在最底部
          this.$nextTick(() => {
            this.$refs.mainIn.scrollTop = this.$refs.mainIn.scrollHeight
          })
        } catch (err) {
          if (err.code === 546) {
            this.canUpload = false
            this.btnShow = false
            this.recorderShow = false
            this.loading = false
            this.thisDialog('未听到您的回答,请重新回答题目', '重新做题').then(
              () => {
                this.handleDialog()
              }
            )
          } else {
            const errMessage = err.message || err
            this.thisDialog(`答题失败，请刷新重做，错误类型(${errMessage})`).then(
              () => {
                location.reload()
              }
            )
          }
        }
      } catch (err) {
        let message = ''
        if (err.includes('xhr request failed')) {
          message = '网络异常'
        } else {
          message = `上传失败(${err})`
        }
        Notify({ type: 'danger', message })
      }
    },
    // 提交回答-音频视频
    postQueRes () {
      this.loading = true
      // 加一层返回保护
      if (!this.sessionId || !this.tableCode) return
      const curData = {
        token: this.token,
        customVars: {
          'x:sessionId': this.sessionId,
          'x:tableName': this.tableCode,
          'x:qIndex': this.queObj.id + ''
        }
      }
      // 上传音频、视频
      Promise.all([
        uploader({ file: this.videoFile, ...curData }),
        uploader({ file: this.audioFile, ...curData })
      ]).then(
        async res => {
          const [video, audio] = res
          this.videoUrls[this.videoIndex] = video.url
          this.audioUrls[this.videoIndex] = audio.url
          // 加一层返回保护
          if (!this.sessionId || !this.tableCode) return
          // 提交回答
          const data = {
            sessionId: this.sessionId,
            tableCode: this.tableCode,
            video: video.url,
            audio: audio.url,
            audioDuration: this.audioDuration,
            ...this.queObj
          }
          posTableQues(data).then(
            queRes => {
              this.midwayBackBool = false
              this.loading = false
              // 清除提问高亮
              const len = this.chatRecords.length
              const { needAnswer, component } = this.chatRecords[len - 1] || {}
              if (component === 'left' && needAnswer) this.chatRecords[len - 1].needAnswer = false
              // 添加回答
              const answer = queRes.data || ''
              // const timeJson = this.setTime()
              this.chatRecords.push({ component: 'right', text: answer, audioDuration: this.audioDuration })
              this.getCurQue()
              this.recorderShow = false
              // 让滚动条始终在最底部
              this.$nextTick(() => {
                this.$refs.mainIn.scrollTop = this.$refs.mainIn.scrollHeight
              })
            }
          ).catch(
            err => {
              if (err.code === 546) {
                // 参数初始化
                this.canUpload = false
                this.btnShow = false
                this.recorderShow = false
                this.loading = false
                this.thisDialog('未听到您的回答,请重新回答题目', '重新做题').then(
                  () => {
                    this.handleDialog()
                  }
                )
              } else {
                const errMessage = err.message || err
                this.thisDialog(`答题失败，请刷新重做，错误类型(${errMessage})`).then(
                  () => {
                    location.reload()
                  }
                )
              }
            }
          )
        }
      ).catch(
        err => {
          let message = ''
          if (err.includes('xhr request failed')) {
            message = '网络异常'
          } else {
            message = `上传失败(${err})`
          }
          Notify({ type: 'danger', message })
        }
      )
    },
    // 提交结果
    submit () {
      postTableRes({
        sessionId: this.sessionId,
        tableCode: this.tableCode
      }).then(
        () => {
          this.goNext(true)
          // this.$router.replace(this.routerPath)
        }
      )
    },
    // 音频文件处理
    audioCreate () {
      this.audioFile = this.recorder.createFile(`${this.tableCode}_${this.queObj.id}_${this.sessionId}`)
      this.audioFiles.push(this.audioFile)
      // 时间计算
      this.audioDuration = this.recorder.getDuration()
      console.log(this.audioDuration)
      // if (this.audioDuration > 60) {
      //   this.textRight = parseInt(this.audioDuration / 60) + " ' " + (this.audioDuration % 60) + " '' "
      // } else {
      //   this.textRight = this.audioDuration + " '' "
      // }
    },
    // 视频文件处理
    videoCreate () {
      this.videoFile = this.fileCreate([this.videoChunk], '.mp4', 'video/mp4')
      this.videoFiles.push(this.videoFile)
    },
    // 创建文件
    fileCreate (blobArr, suffix, type) {
      const fileName = `${this.tableCode}_${this.queObj.id}_${this.sessionId}`
      const dateNow = Date.now()
      return new File(blobArr, `${fileName}${suffix}`, { type, lastModified: dateNow })
    },
    thisDialog (message, btnText = '确定') {
      return Dialog.alert({
        message,
        theme: 'round-button',
        className: 'detail-dialog',
        confirmButtonText: btnText,
        confirmButtonColor: '#34B7B9'
      })
    }
  },
  beforeDestroy () {
    console.log(this.recorder)
  }
  // beforeRouteLeave (to, from, next) {
  //   // 离开后摄像头红点消失
  //   if (window.mediaStream) {
  //     const [media01, media02] = window.mediaStream.getTracks()
  //     if (media01) media01.stop()
  //     if (media02) media02.stop()
  //   }
  //   next()
  // }
}
</script>

<style lang="less" scoped>
.ques-counselling {
  width: 100%;
  height: calc(100 * var(--vh));
  box-sizing: border-box;
  background-color: #D1CDCD;

  .top {
    padding: 0 16px;
    height: 34px;
    line-height: 34px;
    color: #fff;
    background: linear-gradient(90deg, rgba(0, 203, 255, 0.21) 0%, rgba(0, 203, 255, 0.1) 51%, rgba(0, 203, 255, 0.01) 100%);
    z-index: 2;

    img {
      width: 18px;
      height: 18px;
      vertical-align: text-bottom;
      margin-right: 6px;
    }
  }

  .tips {
    margin-top: calc(5 * var(--vh));
    font-size: 14px;
    color: #999;
  }

  .ques-counselling-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0 auto 0 auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .main {
      position: fixed;
      bottom: 15px;
      width: 100%;
      height: calc(40 * var(--vh));
      // margin-top: 16px;
      padding-bottom: 15px;
      overflow-x: hidden;
      overflow-y: scroll;
      z-index: 2;

      .main-in {
        // position: absolute;
        // width: 100%;
        min-height: 100%;
        // left: 0;
        // bottom: 0;
        // height: 100%;
        // overflow-y: auto;
        // padding-bottom: 30px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }
    }

    .bottom {
      height: 150px;
      padding-top: 16px;
      display: flex;
      justify-content: center;
      background-color: #fff;
      position: fixed;
      width: 100%;
      bottom: 0;
      z-index: 3;

      &.isEnd {
        height: auto;
        padding: 10px 0;
        align-items: flex-end;
        background-color: rgba(255, 255, 255, .8);
      }

      .bot_box {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .tips-01 {
        line-height: 1;
        font-size: 14px;
        font-weight: 600;
        color: #000000;
        margin-bottom: 0;
      }

      .tips-02 {
        margin: 10px 0;
        font-size: 12px;
        color: #313131;
      }

      .submit-btn {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

.main-in::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0;
  height: 0;
}

// .main-in::-webkit-scrollbar-thumb {
//   /*滚动条里面小方块*/
//   border-radius: 12px;
//   box-shadow: 8px 0 0 #DFDFDF inset !important;
//   border: 6px solid rgba(0, 0, 0, 0);
//   background-color: rgba(0, 0, 0, 0) !important;
// }
// .main-in::-webkit-scrollbar-track {
//   /*滚动条里面轨道*/
//   // box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
//   border-radius: 10px;
//   background: rgba(0, 0, 0, 0);
// }
</style>
<style lang="less">
.messageBox {
  width: 360px;
  height: 246px;
  border-radius: 8px;

  .el-message-box__content {
    padding: 0;
    margin-top: 60px;
    font-size: 20px;
    color: #666;
    text-align: center;
  }

  .el-message-box__btns {
    text-align: center;
    margin-top: 50px;
  }

  .other-message {
    width: 78px;
    height: 32px;
    border-radius: 2px;
    font-size: 14px;
    font-weight: normal;
    background: #34B7B9;
  }
}

.el-dialog {
  border-radius: 20px;
}

.el-dialog.is-fullscreen {
  border-radius: 0;
}

.el-dialog.is-fullscreen.other-dialg {
  height: calc(100 * var(--vh) - 50px);
  margin-top: 50px;
}

.fadi-start-box {
  .title {
    margin: 1.68rem 0 0 0;
    font-weight: 600;
    color: #000000;
    text-align: center;
  }

  .content {
    padding: 0 1rem;
    margin-top: 2px;
    margin-bottom: .9rem;
    font-size: 14px;
    font-weight: 400;
    color: #666666;
  }
}
</style>
