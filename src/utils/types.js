// export risk
export const mediaErrorTypes = (name) => {
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
}
