<template>
  <!-- 讯飞文本合成语音版本 -->
  <div>
    <div class="main">
      <div class="boxLeft" :style="{color: '#333' }">{{textLeft}}</div>
      <div v-if="isReady" class="laba" :style="{background: !isPlay || isHistory ? '#fff':'#34B7B9' }" @click.once="playAudio">
        <img v-show="isPlay  && !isHistory" src="@/assets/img/test/horn.gif" width="12" height="12" alt="-">
        <img v-if="(!isPlay && !isHistory) || isHistory" src="@/assets/img/test/speaker.png" alt="speaker" style="width: 13px; height: 13px;">
      </div>
      <div v-else class="laba run" :style="{background: '#fff' }">
        <icon-font name="#mdd-loading-01" color="#999"></icon-font>
      </div>
    </div>
  </div>
</template>

<script>
// import Music from '@/utils/music'
import CryptoJS from 'CryptoJS'
import Base64 from 'Base64'
import browser from '@/utils/browser'
// import io from 'socket.io'
export default {
  name: 'dialog-box-left',
  props: {
    textLeft: String,
    url: String,
    needAnswer: Boolean,
    isHistory: {
      type: Boolean,
      default: false
    },
    index: Number
  },
  data () {
    return {
      audioEle: null,
      isPlay: false, // 正在播放
      isReady: false,
      ttsWS: null,
      // 讯飞相关
      APPID: 'f912fc43',
      API_SECRET: 'Yjk0ZDZhNTM4YjM0NzNmZDZiMzA2YmNi',
      API_KEY: '303869817898414bde07f13261bfa29b',
      business: { // 讯飞文字转语音参数
        aue: 'lame', // 默认raw,lame=mp3
        // sfl: 1, // MP3形式下开启为流式返回
        auf: 'audio/L16;rate=16000',
        vcn: 'xiaoyan', // 发音人
        speed: 60, // 音速
        volume: 50, // 音量
        pitch: 50,
        bgs: 1,
        tte: 'UTF8'
      },
      ios: browser().ios
    }
  },
  mounted () {
    // // 插入fadi页面中，后退可一起销毁
    // this.audioEle.addEventListener('play', this.played)
    // this.audioEle.addEventListener('pause', this.paused)
    // this.$once('hook:beforeDestroy', () => {
    //   this.audioEle.removeEventListener('play', this.played)
    //   this.audioEle.removeEventListener('pause', this.paused)
    // })
    // 有文本内容开始合成语音
    if (this.textLeft) {
      this.connectWebSocket()
    }
  },
  beforeDestroy () {
    if (this.audioEle) {
      this.audioEle.paused()
      this.audioEle = null
    }
  },
  methods: {
    // 手动播放
    play () {
      this.audioEle.play()
    },
    // 手动暂停
    playAudio () {
      if (!this.isPlay) return
      this.audioEle.pause()
      this.played()
    },
    playing () {
      this.isPlay = true
      this.audioEle.removeEventListener('playing', this.playing)
    },
    // 监听开始
    played () {
      // this.isPlay = true
      this.isPlay = false
      // this.audioEle = null
      this.audioEle.src = ''
      this.$emit('palyAudio', true)
      // const interval = setInterval(() => {
      //   if (this.audioEle.source.playStatus !== 2) {
      //     clearInterval(interval)
      //     this.isPlay = false
      //     this.audioEle = null
      //     this.$emit('palyAudio', true)
      //     console.log('end')
      //   }
      // }, 0)
      this.audioEle = null
      this.audioEle.removeEventListener('ended', this.played)
    },
    loaded () {
      if (this.index === 0) {
        this.$emit('openStartPrompt')
      } else {
        // this.audioEle.play()
        console.log('played')
      }
      this.audioEle.removeEventListener('canplaythrough', this.loaded)
    },
    // 监听关闭
    paused () {
      this.isPlay = false
      this.$emit('palyAudio', true)
      // this.audioEle.removeEventListener('play', this.played)
      // this.audioEle.removeEventListener('pause', this.paused)
    },
    // 讯飞语音合成链接格式化
    getWebSocketUrl (apiKey, apiSecret) {
      let url = 'wss://tts-api.xfyun.cn/v2/tts'
      const host = location.host
      const date = new Date().toGMTString()
      const algorithm = 'hmac-sha256'
      const headers = 'host date request-line'
      const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/tts HTTP/1.1`
      const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
      const signature = CryptoJS.enc.Base64.stringify(signatureSha)
      const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
      const authorization = window.btoa(authorizationOrigin)
      url = `${url}?authorization=${authorization}&date=${date}&host=${host}`
      return url
    },
    // 文本加密
    encodeText (text, type) {
      if (type === 'unicode') {
        const buf = new ArrayBuffer(text.length * 4)
        const bufView = new Uint16Array(buf)
        for (let i = 0, strlen = text.length; i < strlen; i++) {
          bufView[i] = text.charCodeAt(i)
        }
        let binary = ''
        const bytes = new Uint8Array(buf)
        const len = bytes.byteLength
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        return window.btoa(binary)
      } else {
        return Base64.encode(text)
      }
    },
    // 创建websocket连接
    connectWebSocket () {
      const url = this.getWebSocketUrl(this.API_KEY, this.API_SECRET)
      if ('WebSocket' in window) {
        this.ttsWS = new WebSocket(url)
      } else {
        alert('当前设备不支持ws')
        return
      }
      this.ttsWS.onopen = (e) => {
        console.log(e, 'open')
        const params = {
          common: {
            app_id: this.APPID
          },
          business: this.business,
          data: {
            status: 2,
            text: this.encodeText(this.textLeft, this.business.tte)
          }
        }
        this.ttsWS.send(JSON.stringify(params))
      }
      this.ttsWS.onmessage = (e) => {
        const jsonData = JSON.parse(e.data)
        console.log(jsonData)
        // 状态2合成结束（MP3没用流式只有一条返回），关闭ws
        if (jsonData.data.status === 2) {
          this.isReady = true
          // this.audioEle = new Music(this.url)
          const src = 'data:audio/mp3;base64,' + jsonData.data.audio
          if (this.index === 0) {
            this.audioEle = document.createElement('audio')
            this.audioEle.id = 'gbtAudio'
            this.audioEle.controls = true
            this.audioEle.crossOrigin = 'anonymous'
            this.audioEle.preload = 'auto'
            this.audioEle.src = src
            this.audioEle.style = 'display:none'
            document.getElementById('tableFadi').appendChild(this.audioEle)
            if (this.ios) this.audioEle.load()
          } else {
            this.audioEle = document.getElementById('gbtAudio')
            this.audioEle.autoplay = true
            this.audioEle.src = src
          }
          // this.audioEle = new Music(this.base64ToUrl(jsonData.data.audio, 'mp3'))
          this.audioEle.addEventListener('canplaythrough', this.loaded)
          this.audioEle.addEventListener('playing', this.playing)
          this.audioEle.addEventListener('ended', this.played)
          this.$once('hook:beforeDestroy', () => {
            this.audioEle.removeEventListener('canplaythrough', this.loaded)
            this.audioEle.removeEventListener('playing', this.playing)
            this.audioEle.removeEventListener('ended', this.played)
          })
          // console.log(this.audioEle.src)
          this.ttsWS.close()
        }
      }
      this.ttsWS.onerror = (e) => {
        console.error(e, 'ws-error')
      }
      this.ttsWS.onclose = (e) => {
        console.log(e, 'ws-close')
      }
    },
    // base64转音频链接
    base64ToUrl (base64, fileType) {
      const typeHeader = 'data:application/' + fileType + ';base64,' // 定义base64 头部文件类型
      const audioSrc = typeHeader + base64 // 拼接最终的base64
      const arr = audioSrc.split(',')
      const array = arr[0].match(/:(.*?)/)
      const mime = array[1]
      // 去掉url的头，并转化为byte
      const bytes = window.atob(arr[1])
      // 处理异常,将ascii码小于0的转换为大于0
      const ab = new ArrayBuffer(bytes.length)
      // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
      const ia = new Uint8Array(ab)
      for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      const blob = new Blob([ab], {
        type: mime
      })
      return URL.createObjectURL(blob)
    }
  }
}
</script>
<style lang="less" scoped>
.main {
  display: flex;
  align-items: center;
}
.boxLeft {
  min-width: 40px;
  max-width: 70%;
  min-height: 30px;
  padding: 6px 14px;
  display: inline-flex;
  align-items: center;
  position: relative;
  background: rgba(255, 255, 255, .8);
  border-radius: 8px;
  margin: 10px 0;
  margin-left: 26px;
  font-size: 14px;
  color: #555555;
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
  color: #FFFFFF;
  transform: rotateX(180deg) rotateZ(-115deg);
}
.laba {
  width: 22px;
  height: 22px;
  background: #34B7B9;
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
}
</style>
