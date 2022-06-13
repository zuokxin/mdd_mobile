import { encodeWav } from '@/utils/media/audio'
class Recorder {
  config = {
    bufferLen: 4096,
    numChannels: 1,
    mimeType: 'audio/wav'
  }

  init = false

  constructor ({ stream, cfg }) {
    Object.assign(this.config, cfg)
    this.audioctx = new AudioContext()
    this.media = this.audioctx.createMediaStreamSource(stream)
    // 默认4096，1，1
    this.process = this.audioctx.createScriptProcessor(
      this.config.bufferLen,
      this.config.numChannels,
      this.config.numChannels
    )
    this.media.connect(this.audioctx.createGain())
    this.media.connect(this.process)

    this.sampleRate = this.audioctx.sampleRate

    this.audioBuffers = []
  }

  start (cb) {
    const status = true
    if (this.init) {
      this.audioctx.resume().then(() => {
        if (cb) cb(status)
      })
    } else {
      this.process.connect(this.audioctx.destination)
      this.init = true
      if (cb) cb(status)
    }
  }

  pause (cb) {
    this.audioctx.suspend().then(() => {
      const status = true
      if (cb) cb(status)
    })
  }

  close (cb) {
    this.audioctx.close().then(() => {
      const status = true
      if (cb) cb(status)
    })
  }

  // 当前只支持wav
  createFile (name = 'download') {
    const resdata = encodeWav(this.sampleRate, this.audioBuffers)
    const audioFile = fileCreate({
      name,
      blobArr: [resdata],
      suffix: '.wav',
      type: 'audio/wav'
    })
    this.audioBuffers = []
    return audioFile
  }

  // onaudioprocess () {
  //   return this.process.onaudioprocess
  // }
}

function fileCreate ({ name, blobArr, suffix, type }) {
  const dateNow = Date.now()
  return new File(blobArr, `${name}${suffix}`, { type, lastModified: dateNow })
}

export default Recorder
