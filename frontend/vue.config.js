const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: '../frontend/docs',
  publicPath: '/ML-project/'
})