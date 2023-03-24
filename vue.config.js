module.exports = {
  pages: {
    index: {
      // 入口
      entry: 'src/main.js'
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://toutiao.itheima.net/',
        pathRewrite: { '^/api': '' },
        ws: true,
        changeOrigin: true
        // 查看当前跨域请求地址
        // logLevel: 'debug'
      }
    }
  }
}
