const pages = {
  title: '复变云愈',
  cdn: {},
  externals: {}
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
