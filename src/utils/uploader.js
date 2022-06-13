import * as qiniu from 'qiniu-js'

export function qiniuUpload ({ file, customVars = null }, token, observer = {}) {
  const config = {
    useCdnDomain: true,
    region: qiniu.region.z0,
    checkByMD5: true
  }
  const putExtra = {
    fname: file.name,
    // params: {},
    customVars,
    mimeType: null
  }
  const observable = qiniu.upload(file, null, token, putExtra, config)
  // this.subscription = observable.subscribe(observer)
  observable.subscribe(observer)
}

export function uploader ({ file, customVars = null, token, next }) {
  return new Promise((resolve, reject) => {
    qiniuUpload(
      {
        file,
        customVars
      },
      token,
      {
        next: (res) => {
          // console.log('next', res)
          if (next) next(res)
        },
        complete: (res) => {
          resolve(res)
        },
        error: (err) => {
          let message = ''
          try {
            const has = err.message.indexOf('error')
            const start = has === -1 ? -1 : has + 8
            message = err.message.substring(start, err.message.length - 2)
          } catch (e) {
            message = err.reqId
          }
          const errMessage = `${err.code}:${message}`
          reject(errMessage)
        }
      }
    )
  })
}

// --------------- use -------------------
// qiniuUpload(
//   {file},
//   token,
//   {
//     next (res) {
//       console.log('next', res)
//     },
//     complete (res) {
//       console.log('complete', res)
//     },
//     error (err) {
//       console.log('error', err)
//     }
//   }
// )
