var path = require('path')
var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var HashedModuleIdsPlugin = require('./HashedModuleIdsPlugin')
var WebpackMd5Hash = require('webpack-md5-hash')
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var UglifyJsPlugin = require("uglifyjs-webpack-plugin");
var OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
var autoprefixer = require('autoprefixer')
var postcssImport = require('postcss-import')
var px2rem = require('postcss-px2rem');
var precss = require('precss')
var env = config.build.env

var webpackConfig = merge(baseWebpackConfig, {
    mode:'production',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: "postcss-loader?sourceMap", // 
                        options: {
                            parser: 'postcss-comment-2',  //   scss中//的注释不会报错
                            ident: 'postcss',
                            plugins: (loader) => [
                              postcssImport({ //支持import scss，不然@impost xxx.scss报错
                                  addDependencyTo: webpack,
                                  path:["src/assets/scss"] //相对项目根目录
                              }),
                              precss, //postcss使用sass语法,不然语法报错
                              autoprefixer({ browsers: ["last 8 version"] })
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader?sourceMap" // 解析js中的@import xxx.css
                    }, 
                    {
                        loader: "postcss-loader?sourceMap", // postcss-loader要在sass-loader前面
                        options: {
                            parser: 'postcss-comment-2',  //   scss中//的注释不会报错
                            ident: 'postcss',
                            plugins: (loader) => [
                              postcssImport({ //支持import scss，不然@impost xxx.scss报错
                                  addDependencyTo: webpack,
                              }),
                              precss, //postcss使用sass语法,不然语法报错
                            //   px2rem({ //px转rem
                            //       remUnit: 100,
                            //       baseDpr: 2
                            //   }),
                              autoprefixer({ browsers: ["last 8 version"] })
                            ]
                        }
                    },
                    {
                        loader: "sass-loader?outputStyle=expanded&sourceMap", // compiles Sass to CSS
                        options: {
                            includePaths: ["src/assets/scss"]
                        }
                    }, 
                ]
            }
        ]
    },
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('[name]/app.[chunkhash].min.js')
    },
    plugins: [
        // http://vuejs.github.io/vue-loader/en/workflow/production.html
        new webpack.DefinePlugin({
            'process.env': env
        }),
        // extract css into its own file
        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        // new HtmlWebpackPlugin({
        //     filename: config.build.index,
        //     template: 'index.html',
        //     inject: true,
        //     // minify: {
        //     //     removeComments: true,
        //     //     collapseWhitespace: true,
        //     //     removeAttributeQuotes: true
        //     //         // more options:
        //     //         // https://github.com/kangax/html-minifier#options-quick-reference
        //     // },
        //     // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        //     chunksSortMode: 'dependency'
        // }),
        new WebpackMd5Hash(),
        new HashedModuleIdsPlugin(),
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: utils.assetsPath('[name]/app.[contenthash].min.css')
        })
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({}) //css压缩
        ],
        splitChunks: {
            cacheGroups: {
                vendor: { //这个是组名，自己定义
                    test: /[\\/]node_modules[\\/]/, //node_modules 下公共模块都抽取到pages/vendor下
                    name: "pages/vendor",
                    chunks: "all" //范围为所有代码块
                }
            }
        },
        runtimeChunk: {
            name: 'pages/manifest'
        }
    }
})

if (config.build.productionGzip) {
    var CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

var htmlWebpackPlugins = [] // 多html对应多个js入口文件

Object.keys(webpackConfig.entry).forEach(function(name, i) {
    
    // https://github.com/ampedandwired/html-webpack-plugin
    var pageName = name.split('\\')[1]
    htmlWebpackPlugins.push(new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, '../dist/pages/' + pageName + '/' + 'index.html'),
        template: './src/' + name + '/app.html',
        chunks: ['pages/vendor', 'pages/manifest', name],
        chunksSortMode: 'none',
        inject: true
    }))
})

webpackConfig.plugins = webpackConfig.plugins.concat(htmlWebpackPlugins)

module.exports = webpackConfig