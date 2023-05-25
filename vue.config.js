const utils = require('./config/utils.js')
const httpProxy = require('./config/http.proxy.js')
const path = require('path')
// const { _ } = require('core-js')
module.exports = {
  // 基本路径
  publicPath: process.env.NODE_ENV === 'production' ? './' : './',

  // 生产环境不产生map
  productionSourceMap: false,

  // 构建时输出目录
  outputDir: 'dist',

  chainWebpack: config => {
    // config.resolve.symlinks(true)
    config.resolve.alias
      .set('@', path.resolve(__dirname, 'src'))
    if (process.env.use_analyzer) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  },
  devServer: {
    port: 9000,
    hot: true,
    host: '0.0.0.0',
    https: false,
    open: false, // 配置自动启动浏览器
    proxy: {
      '/api': httpProxy(),
      '/static': httpProxy()
    }
  },
  pages: utils.pagesConfig,

  configureWebpack: {
    externals: utils.externals
  },

  transpileDependencies: [],
  css: {
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        modifyVars: {
          // 直接覆盖变量
          // 'text-color': '#111',
          // 'border-color': '#eee'
          hack: `true; @import "${path.join(__dirname, './src/assets/style/reset-vant.less')}";`
        }
      }
    }
  }
}
