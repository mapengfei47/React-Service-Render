const path = require('path')
const nodeExternals = require('webpack-node-externals')
const webpackMerge = require('webpack-merge')
const config = require('./webpack.base')

let serverConfig = {
    // 指定执行目标环境
    target: 'node',
    // 指定运行模式
    mode: 'development',
    // webpack打包入口文件
    entry: './src/server/index.js',
    // webpack打包生成文件名及目录
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname,'./build')
    },
    externals : [nodeExternals()],
}

module.exports = webpackMerge.merge(config,serverConfig)