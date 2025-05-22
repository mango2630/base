// 公共环境配置
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.ts', // 相对当前文件的入口文件
    output: {
        filename: 'app.js'   // 输出到 dist 目录下的文件名
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx']  // 告诉 webpack 使用.js、.ts、.tsx后缀的文件
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/i,
                use: [{
                    loader: 'ts-loader'  // 使用 ts-loader 来编译 ts 文件
                }],
                exclude: /(node_modules|typescript-in-action)/  // 排除 node_modules 目录
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ // 通过一个模版帮助我们生成网站的首页，把输出文件自动嵌入到网站首页中。
            template: './src/tpl/index.html'
        })
    ]
}
