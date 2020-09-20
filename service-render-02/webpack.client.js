const path = require('path')
const webpackMerge = require('webpack-merge')
const config = require('./webpack.base')

let clientConfig = {
    // 指定运行模式
    mode: 'development',
    // webpack打包入口文件
    entry: './src/client/index.js',
    // webpack打包生成文件名及目录
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname,'./public')
    },
}

module.exports = webpackMerge.merge(config ,clientConfig)