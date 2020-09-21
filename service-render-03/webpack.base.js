module.exports = {
    // 配置js文件解析规则，ES6转化，react代码识别
    
    devtool: 'eval-source-map',
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