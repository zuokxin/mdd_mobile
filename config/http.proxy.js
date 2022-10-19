function httpproxy () {
  // 测试服务器
  // var ip = 'depression.local.fubianmed.com'
  // var port = '9020'
    return {
    target: 'http://depression.local.fubianmed.com',
    changeOrigin: true
  }
}
module.exports = httpproxy
