'use strict';
// 开发环境
const merge = require('webpack-merge');
const path = require('path');
var webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
// const NpmInstallPlugin = require('npm-install-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common.js');

const devConfig = {
    // 方便查看错误详细位置dev
    devtool: 'inline-source-map',
    stats: {
        // 增加资源信息
        assets: false,
        // Add webpack version information
        version: false,
        // Add the hash of the compilation
        hash: false,
        // 增加包 和 包合并 的来源信息
        chunkOrigins: false,
        // 增加内置的模块信息
        modules: false,
        // 增加时间信息
        timings: false,
        // 增加错误的详细信息（就像解析日志一样）
        errorDetails: false,
        // `webpack --colors` 等同于
        colors: true
    },
    entry: {
        app: [
            'babel-polyfill',
            // 热加载
            'react-hot-loader/patch',
            path.join(__dirname, '../src/index.js')
        ]
    },
    output: {
        /*这里本来应该是[chunkhash]的，但是由于[chunkhash]和react-hot-loader不兼容。只能妥协*/
        filename: '[name].[hash].js'
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.css$/,
                // postcss-loader // 提高css的语法兼容性
                // 注： 根目录需要增加postcss.config.js文件
                // module.exports = {
                //     plugins: {
                //         'postcss-cssnext': {}
                //     }
                // };
                // css-loader     // 解析css的import或者什么
                // style-loader   // 解析css语法并注入js
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                    //   "sass-loader"
                ] // 从右向左执行
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'] // 从右向左执行
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, '../dist'),
        historyApiFallback: true, // 路由开启history模式
        port: 8080,
        host: 'localhost',
        compress: true, // 开启服务端压缩
        clientLogLevel: 'none', // 去除Hot的日志
        hot: true // 热加载
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            filename: 'index.html',
            template: path.join(__dirname, '../src/index.html'),
            hash: true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS
            minify: {
                // 压缩html页面的js等东西
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        }),
        // 模块自动装载机，自动安装依赖
        // new NpmInstallPlugin({
        //     // 使用 --save 或者 --save-dev
        //     dev: true,
        //     // 安装缺少的 peerDependencies
        //     peerDependencies: false,
        //     // 减少控制台日志记录的数量
        //     quiet: false,
        //     // npm command used inside company, yarn is not supported yet
        //     npm: 'npm'
        // }),
        // 此插件允许你安装库后自动重新构建打包文件。
        new WatchMissingNodeModulesPlugin(path.join(__dirname, '../node_modules')),
        // 如果路径有误则直接报错。
        new CaseSensitivePathsPlugin(),
        // 指定环境
        //许多 library 将通过与 process.env.NODE_ENV 环境变量关联，以决定 library 中应该引用哪些内容。
        //例如，当不处于生产环境中时，某些 library 为了使调试变得容易，可能会添加额外的日志记录(log)和测试(test)。
        //其实，当使用 process.env.NODE_ENV === 'production' 时，一些 library 可能针对具体用户的环境进行代码优化，从而删除或添加一些重要代码。
        //我们可以使用 webpack 内置的 DefinePlugin 为所有的依赖定义这个变量：
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),
        // 当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin() // 热加载
    ]
};
module.exports = merge({
    customizeArray(a, b, key) {
        /*entry.app不合并，全替换*/
        if (key === 'entry.app') {
            return b;
        }
        return undefined;
    }
})(commonConfig, devConfig);
