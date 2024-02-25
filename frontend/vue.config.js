const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'frontend/docs',
  publicPath: process.env.NODE_ENV === 'production'
    ? '/ML-project/' // GitHub 저장소 이름으로 변경
    : '/'
})