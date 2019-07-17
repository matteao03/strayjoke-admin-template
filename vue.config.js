const path = require('path')
const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  devServer: {
    port: 8080, // 端口号
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 设置你调用的接口域名和端口号 别忘了加http
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/api': '' // 这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'https://api.douban.com/user/add'，直接写‘/api/user/add’即可，此处的‘api’可以设置为自己想要设置的任何词语，符合规范即可
        }
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  lintOnSave: process.env.NODE_ENV !== 'production',
  chainWebpack: config => {
    config.module.rules.delete('svg') // 重点:删除默认配置中处理svg,
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include
      .add(resolve('src/icons')) // 处理svg目录
      .add(resolve('src/icons/menu'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'windows.jQuery': 'jquery'
      })
    ]
  }
}
