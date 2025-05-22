// 配置环境入口
const { merge } = require('webpack-merge')  // 合并配置文件 https://blog.csdn.net/qq_37189082/article/details/120726314
const baseConfig = require('./webpack.base.config')
const devConfig = require('./webpack.dev.config')
const proConfig = require('./webpack.pro.config')

module.exports = (env, argv) => { // 这里为什么会传入环境参数？
    let config = argv.mode === 'development' ? devConfig : proConfig;
    return merge(baseConfig, config);
};
