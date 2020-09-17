const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
    // 指定执行目标环境
    target: 'node',
    // 指定运行模式
    mode: 'development',
    // webpack打包入口文件
    entry: './src/index.js',
    // webpack打包生成文件名及目录
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname,'./build')
    },
    externals : [nodeExternals()],

    // 配置js文件解析规则，ES6转化，react代码识别
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader:'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['react','stage-0',['env',{
                        targets: {
                            browsers: ['last 2 versions']
                        }
                    }]]
                }
            }
        ]
    }
}