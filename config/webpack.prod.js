'use strict';
// 生产环境
const merge = require('webpack-merge');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 监测器
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const commonConfig = require('./webpack.common.js');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Jarvis = require('webpack-jarvis');

const publicConfig = {
    // 无法捕获错误位置，强压缩代码 prod
    devtool: 'cheap-module-source-map',
    stats: {
        // 增加资源信息
        assets: true,
        // Add webpack version information
        version: true,
        // Add the hash of the compilation
        hash: true,
        // 增加包 和 包合并 的来源信息
        chunkOrigins: false,
        // 增加内置的模块信息
        modules: false,
        // 增加时间信息
        timings: true,
        // 增加错误的详细信息（就像解析日志一样）
        errorDetails: true,
        // `webpack --colors` 等同于
        colors: true
    },
    module: {
        rules: [
            {
                // 抽离css文件
                // 注： 不能与上面的
                // test: /\.css$/,
                // use: ['style-loader', 'css-loader']
                // 一起使用
                // 上面的功能是将css注入到js中，这个是将css抽离js
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
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'postcss-loader'
                        // 'sass-loader'
                    ]
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'sass-loader']
                })
            },
            {
                test: /\.(png|jpg|gif|svg|svgz)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'static/images/[name].[hash:7].[ext]'
                        }
                    },
                    'image-webpack-loader'
                    // {
                    //     loader: 'image-webpack-loader',
                    //     options: {
                    //         bypassOnDebug: true, // webpack@1.x
                    //         disable: true // webpack@2.x and newer
                    //     }
                    // }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist/**/*.*', 'dist/*.*'], {
            root: path.join(__dirname, '../'),
            verbose: true,
            dry: false
        }),
        new HtmlWebpackPlugin({
            // inject主要是设置将js和css文件插入在html的哪个位置，由于js的加载时同步进行的，所以它的位置对网页的加载速度是有影响的。inject共有四个可选项：true、body、head和false。
            inject: true,
            filename: 'index.html',
            template: path.join(__dirname, '../src/index.html'),
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
        // new BundleAnalyzerPlugin(),// 查看打包体积等情况
        // new CompressionPlugin({ // gzip模式，感觉比较大
        //     asset: '[path].gz[query]',
        //     algorithm: 'gzip',
        //     test: /\.(js|html)$/,
        //     threshold: 10240,
        //     minRatio: 0.8
        // }),
        // css压缩 //有高版本
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
        }),
        // 优化es6的 模块提升作用域 缩小体积
        new webpack.optimize.ModuleConcatenationPlugin(),
        // 按事件顺序排列模块和块。这节省了空间，因为经常引用的模块和块可以获得更小的ID。
        // 如果为true，则条目块中的引用具有更高的优先级。
        // 注：TypeError: webpack.optimize.OccurenceOrderPlugin is not a constructor
        // 如果出现这个。。。多加个r 像下面这个
        new webpack.optimize.OccurrenceOrderPlugin(true),
        // new webpack.optimize.DedupePlugin(),
        new UglifyJSPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false,
                    comparisons: false,
                    drop_debugger: true, // 去除debug
                    drop_console: false // 去除console.log
                },
                mangle: {
                    safari10: true
                },
                output: {
                    comments: false,
                    ascii_only: true
                }
            }
        }),
        // 指定环境
        //许多 library 将通过与 process.env.NODE_ENV 环境变量关联，以决定 library 中应该引用哪些内容。
        //例如，当不处于生产环境中时，某些 library 为了使调试变得容易，可能会添加额外的日志记录(log)和测试(test)。
        //其实，当使用 process.env.NODE_ENV === 'production' 时，一些 library 可能针对具体用户的环境进行代码优化，从而删除或添加一些重要代码。
        //我们可以使用 webpack 内置的 DefinePlugin 为所有的依赖定义这个变量：
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        // 防止css注入到js中，单独抽离css 需要配合 rules使用
        new ExtractTextPlugin({
            filename: 'static/css/[name].[contenthash:5].css',
            allChunks: true
        }),
        new SWPrecacheWebpackPlugin({
            // By default, a cache-busting query parameter is appended to requests
            // used to populate the caches, to ensure the responses are fresh.
            // If a URL is already hashed by Webpack, then there is no concern
            // about it being stale, and the cache-busting can be skipped.
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename: 'service-worker.js',
            staticFileGlobs: ['dist/**/*.{js,html,css}'],
            stripPrefix: 'dist/',
            logger(message) {
                if (message.indexOf('Total precache size is') === 0) {
                    // This message occurs for every build and is a bit too noisy.
                    return;
                }
                if (message.indexOf('Skipping static resource') === 0) {
                    // This message obscures real errors so we ignore it.
                    // https://github.com/facebookincubator/create-react-app/issues/2612
                    return;
                }
                console.log(message);
            },
            minify: true,
            // For unknown URLs, fallback to the index page
            navigateFallback: './dist/index.html',
            // Ignores URLs starting from /__ (useful for Firebase):
            // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
            navigateFallbackWhitelist: [/^(?!\/__).*/],
            // Don't precache sourcemaps (they're large) and build asset manifest:
            staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/]
        }),
        new ManifestPlugin({
            fileName: 'asset-manifest.json'
        }),
        // 编译日志
        new Jarvis({
            watchOnly: false,
            port: 1337 // optional: set a port
        })
    ]
};

module.exports = merge(commonConfig, publicConfig);
