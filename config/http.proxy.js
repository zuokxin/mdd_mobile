function httpproxy () {
  // 测试服务器
  var ip = '10.0.1.65'
  // var ip = '10.0.0.20'
  var port = '9020'
  return {
    target: 'http://' + ip + ':' + port,
    changeOrigin: true
  }
}
module.exports = httpproxy
