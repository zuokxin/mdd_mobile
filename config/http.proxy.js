function httpproxy () {
  // 测试服务器
  // var ip = '10.0.0.154'
  var ip = '10.0.0.19'
  var port = '9020'
  return {
    target: 'http://' + ip + ':' + port,
    changeOrigin: true
  }
}
module.exports = httpproxy
