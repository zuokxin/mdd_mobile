class Music {
  constructor (url, loop) {
    this.context = new (window.AudioContext || window.webkitAudioContext)()
    this.url = url
    this.handle = {}
    this.loop = loop || false
    this.source = null
    this.scriptNode = null
    this.audioBuffer = null
    this.loadMusic()
  }

  stop () {
    if (this.source) {
      this.source.stop()
      this.source.playStatus = 1
    }
  }

  // 0 初始化完成未播放 1 已暂停 2 正在播放
  play (time) {
    if (this.source) {
      switch (this.source.playStatus) {
        case 0:
          if (time) {
            this.source.start(0, time)
          } else {
            this.source.start()
          }
          break
        case 1:
          this.setSource(this.audioBuffer) // 重新设置buffer
          if (time) {
            this.source.start(0, time)
          } else {
            this.source.start()
          }
          break
        case 2:
          if (time) {
            this.source.stop(0)
            this.source.onended = () => {
              this.source.playStatus = 1
              this.play(time)
            }
          }
          return false
      }
      this.source.playStatus = 2
    }
  }

  /* 实例上监听 */
  addEventListener (eventName, callback) {
    if (!this.handle[eventName]) {
      this.handle[eventName] = []
    }
    this.handle[eventName].push(callback)
  }

  setSource (buffer) {
    this.source = null // 销毁掉旧的source
    this.source = this.context.createBufferSource()
    // this.scriptNode = this.context.createScriptProcessor(4096, 1, 1)
    this.source.buffer = buffer
    // console.log(buffer)
    this.source.loop = this.loop
    // this.source.connect(this.scriptNode)
    // this.scriptNode.connect(this.context.destination)
    this.source.connect(this.context.destination)
    this.source.playStatus = 0
    this.source.onended = () => {
      this.source.playStatus = 1
    }
  }

  /* 创建source */
  initSource (arrayBuffer) {
    const that = this
    that.context.decodeAudioData(arrayBuffer,
      function (buffer) {
        that.audioBuffer = buffer // 缓存起来
        that.setSource(buffer)
        const event = that.handle.load
        if (event) {
          event.map(v => v.call(that))
        }
      },
      function (error) {
        const event = that.handle.error
        if (event) {
          event.map(v => v.call(that, error))
        }
      })
  }

  /* 使用xhr加载音乐文件 */
  loadMusic () {
    const that = this
    const xhr = new XMLHttpRequest()
    xhr.open('GET', that.url, true)
    xhr.responseType = 'arraybuffer'
    xhr.send()
    xhr.addEventListener('load', function (e) {
      that.initSource(e.target.response)
    })
    xhr.addEventListener('error', function (error) {
      console.log(error, '音频加载出错了')
      that.loadMusic()
      const event = that.handle.error
      if (event) {
        event.map(v => v.call(that, error))
      }
      console.log(event)
    })
  }
}

export default Music
