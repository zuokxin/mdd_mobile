const pages = {
  title: '云愈心理',
  cdn: {},
  externals: {
    'axios': 'axios',
    'dayjs': 'dayjs',
    'Base64': 'Base64',
    'CryptoJS': 'CryptoJS'
  }
}

exports.pagesConfig = {
  index: {
    // page 的入口
    entry: `src/main.js`,
    // 模板来源
    template: 'public/index.html',
    // 页面标题
    title: pages.title,
    chunks: ['chunk-vendors', 'chunk-common', 'index'],
    cdn: pages.cdn
  }
}
exports.externals = pages.externals
