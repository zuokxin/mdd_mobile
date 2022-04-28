// 获取原始录音数据
function getRawData (AudioDatas = []) {
  const size = 4096 * AudioDatas.length
  const rawdata = new Float32Array(size)
  let offset = 0
  AudioDatas.forEach(audiodata => {
    rawdata.set(audiodata, offset)
    offset += audiodata.length
  })
  return rawdata
}

function writestr (data, str, offset) {
  for (let i = 0; i < str.length; i++) {
    data.setUint8(offset + i, str.charCodeAt(i))
  }
}

/**
 * 音频处理
*/
// 原始音频编码为指定格式的wav
function encodeWav (inputsamplerate, AudioDatas, samplebit = 16) {
  const rate = 1
  const rawdata = getRawData(AudioDatas)
  const len = rawdata.length / rate
  // res为导出时的rawdata
  const res = new Float32Array(len)
  for (let i = 0; i < len; i++) {
    res[i] = rawdata[i * rate]
  }
  const datalen = len * (samplebit / 8)
  // 44bit的wav头
  const buffer = new ArrayBuffer(44 + datalen)
  let offset = 0
  const resdata = new DataView(buffer)
  writestr(resdata, 'RIFF', offset)
  offset += 4
  resdata.setUint32(offset, 36 + datalen, true)
  offset += 4
  writestr(resdata, 'WAVE', offset)
  offset += 4
  writestr(resdata, 'fmt ', offset)
  offset += 4
  // 过滤字节,一般为 0x10 = 16
  resdata.setUint32(offset, 16, true)
  offset += 4
  // 格式类别 (PCM形式采样数据)
  resdata.setUint16(offset, 1, true)
  offset += 2
  // 通道数
  resdata.setUint16(offset, 1, true)
  offset += 2
  // 采样率,每秒样本数,表示每个通道的播放速度
  resdata.setUint32(offset, inputsamplerate, true)
  offset += 4
  // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8
  resdata.setUint32(offset, 1 * inputsamplerate * (samplebit / 8), true)
  offset += 4
  // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8
  resdata.setUint16(offset, 1 * (samplebit / 8), true)
  offset += 2
  // 每样本数据位数
  resdata.setUint16(offset, samplebit, true)
  offset += 2
  // 数据标识符
  writestr(resdata, 'data', offset)
  offset += 4
  // 采样数据总数,即数据总大小-44
  resdata.setUint32(offset, datalen, true)
  offset += 4
  // 写入采样数据
  if (samplebit === 8) {
    for (let i = 0; i < res.length; i++, offset++) {
      const s = Math.max(-1, Math.min(1, res[i]))
      const t = s < 0 ? s * 0x8000 : s * 0x7FFF
      const val = parseInt(255 / (65535 / (t + 32768)))
      resdata.setInt8(offset, val, true)
    }
  } else {
    for (let i = 0; i < res.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, res[i]))
      const val = s < 0 ? s * 0x8000 : s * 0x7FFF
      resdata.setInt16(offset, val, true)
    }
  }
  return resdata
}

function mergeArray (list) {
  const length = list.length * list[0].length
  const data = new Float32Array(length)
  let offset = 0
  for (let i = 0; i < list.length; i++) {
    data.set(list[i], offset)
    offset += list[i].length
  }
  return data
}

// 交叉合并左右声道的数据
function interleaveLeftAndRight (left, right) {
  const totalLength = left.length + right.length
  const data = new Float32Array(totalLength)
  for (let i = 0; i < left.length; i++) {
    const k = i * 2
    data[k] = left[i]
    data[k + 1] = right[i]
  }
  return data
}

function createWavFile (audioData) {
  // 写入wav头部，代码同上
  const WAV_HEAD_SIZE = 44
  const buffer = new ArrayBuffer(audioData.length * 2 + WAV_HEAD_SIZE)
  // 需要用一个view来操控buffer
  const view = new DataView(buffer)
  // 写入wav头部信息
  // RIFF chunk descriptor/identifier
  writeUTFBytes(view, 0, 'RIFF')
  // RIFF chunk length
  view.setUint32(4, 44 + audioData.length * 2, true)
  // RIFF type
  writeUTFBytes(view, 8, 'WAVE')
  // format chunk identifier
  // FMT sub-chunk
  writeUTFBytes(view, 12, 'fmt ')
  // format chunk length
  view.setUint32(16, 16, true)
  // sample format (raw)
  view.setUint16(20, 1, true)
  // stereo (2 channels)
  view.setUint16(22, 2, true)
  // sample rate
  view.setUint32(24, 44100, true)
  // byte rate (sample rate * block align)
  view.setUint32(28, 44100 * 2, true)
  // block align (channel count * bytes per sample)
  view.setUint16(32, 2 * 2, true)
  // bits per sample
  view.setUint16(34, 16, true)
  // data sub-chunk
  // data chunk identifier
  writeUTFBytes(view, 36, 'data')
  // data chunk length
  view.setUint32(40, audioData.length * 2, true)
  // 写入PCM数据
  const length = audioData.length
  let index = 44
  const volume = 1
  for (let i = 0; i < length; i++) {
    view.setInt16(index, audioData[i] * (0x7FFF * volume), true)
    index += 2
  }
  return buffer
}
function writeUTFBytes (view, offset, string) {
  var lng = string.length
  for (var i = 0; i < lng; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}

export { encodeWav, createWavFile, interleaveLeftAndRight, mergeArray }
