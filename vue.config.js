const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath:'/',
  transpileDependencies: true,
  devServer: {
    historyApiFallback: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:6776',
        changeOrigin: true,
        pathRewrite: { '^/api': '' }
      }
    }
  }
})
