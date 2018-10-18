'use strict';
// 共用的webpack配置
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const commonConfig = {
    entry: {
        app: [
            // ES6在Array对象上新增了Array.from方法。Babel就不会转码这个方法。如果想让这个方法运行，必须使用babel-polyfill，为当前环境提供一个垫片
            'babel-polyfill',
            path.join(__dirname, '../src/index.js')
        ],
        // 定义一个vendor入口，与plugin的CommonsChunkPlugin vendor对应，
        // 将所有插件放入vendor中防止二次打包
        vendor: ['react', 'react-router-dom', 'redux', 'react-dom', 'react-redux', 'immutable', 'redux-saga']
    },
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'static/js/[name].[chunkhash].js',
        // 除了entry定义的js之外的js打包成这个，不设置这个的话打包出来就是0.bundle.js ...，
        //[name]中的name是import UserInfo from 'bundle-loader?lazy&name=userInfo!pages/UserInfo/UserInfo'; name=后面的那个name
        // chunkFilename: '[name].js'
        chunkFilename: 'static/js/[name].[chunkhash].js',
        //让静态文件的链接定位到静态服务器
        publicPath: '/'
    },
    module: {
        rules: [
            // 路由懒加载，这个放在js前面，待测试
            {
                test: /src\\pages(\\.*).(jsx|js)/,
                include: /src/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'bundle-loader',
                        options: {
                            lazy: true,
                            name: '[name].async'
                        }
                    }
                ]
            },
            {
                test: /\.(jsx|js)$/,
                use: [
                    {
                        // 当有设置时，指定的目录将用来缓存 loader 的执行结果。
                        // 之后的 webpack 构建，将会尝试读取缓存，来避免在每次执行时，可能产生的、高性能消耗的 Babel 重新编译过程
                        loader: 'babel-loader?cacheDirectory=true',
                        options: {}
                    }
                ],
                include: path.join(__dirname, '../src')
            },
            // {
            //     // url-loader里面集成了file-loader
            //     loader: 'file-loader',
            //     // Exclude `js` files to keep "css" loader working as it injects
            //     // it's runtime that would otherwise processed through "file" loader.
            //     // Also exclude `html` and `json` extensions so they get processed
            //     // by webpacks internal loaders.
            //     exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            //     options: {
            //         name: 'static/img/[name].[hash:8].[ext]'
            //     }
            // },

            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../src/manifest.json'),
                to: path.resolve(__dirname, '../dist/')
                // ignore: ['.*']
            },
            {
                from: path.resolve(__dirname, '../src/favicon.ico'),
                to: path.resolve(__dirname, '../dist/')
                // ignore: ['.*']
            }
        ]),
        // 忽略所匹配的moment.js
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        //vendor.xxx.js名字永久不变，一直缓存在用户本地。~要配合CommonsChunkPlugin runtime使用
        new webpack.HashedModuleIdsPlugin(),
        // 引入顺序在这里很重要。CommonsChunkPlugin 的 'vendor' 实例，必须在 'runtime' 实例之前引入。
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        // manifest就是抽取vendor里面经常变动的部分(比如异步加载js模块等部分)，避免每次打包都会让vendor的hash变动，从而避免加载新的vendor。
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity
        }),
        //如上所述，我们这里只简略地介绍一下。runtime，以及伴随的 manifest 数据，主要是指：在浏览器运行时，webpack 用来连接模块化的应用程序的所有代码。runtime 包含：在模块交互时，连接模块所需的加载和解析逻辑。包括浏览器中的已加载模块的连接，以及懒加载模块的执行逻辑。
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'
        }),
       
        // 全局插件挂载
        // new webpack.ProvidePlugin({
        //     $: "jquery",
        //     jQuery: "jquery",
        //     "window.jQuery": "jquery"
        // })
    ],
    resolve: {
        extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'], // 以结尾的可以省略后缀
        alias: {
            // 别名系统
            // 我们可以通过 page/... 或者 component/... 访问文件
            // 相当于nuxt的~/ 或者配置 @/...
            '@': path.join(__dirname, '../src'),
            assets: path.join(__dirname, '../src/assets'),
            pages: path.join(__dirname, '../src/pages'),
            components: path.join(__dirname, '../src/components'),
            routers: path.join(__dirname, '../src/routers'),
            actions: path.join(__dirname, '../src/redux/actions'),
            reducers: path.join(__dirname, '../src/redux/reducers'),
            utils: path.join(__dirname, '../src/utils'),
            dist: path.join(__dirname, '../dist')
        }
    }
};
module.exports = commonConfig;
