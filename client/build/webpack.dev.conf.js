var config = require('../config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var precss = require('precss')
var autoprefixer = require('autoprefixer')
var postcssImport = require('postcss-import')
var px2rem = require('postcss-px2rem');
// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

var webpackConfig = merge(baseWebpackConfig, {
    mode:'development',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    { 
                        loader: 'style-loader'
                    },{
                        loader: 'css-loader'
                    },{
                        loader: "postcss-loader", // 
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
                use: [
                    {
                        loader: "style-loader" // Adds CSS to the DOM by injecting a <style> tag
                    }, {
                        loader: "css-loader" // 解析js中的@import xxx.css
                    }, 
                    {
                        loader: "postcss-loader", // postcss-loader要在sass-loader前面
                        options: {
                            parser: 'postcss-comment-2',  //   scss中//的注释不会报错
                            ident: 'postcss',
                            plugins: (loader) => [
                              postcssImport({ //支持import scss，不然@impost xxx.scss报错
                                  addDependencyTo: webpack,
                              }),
                              precss, //postcss使用sass语法,不然语法报错
                              autoprefixer({ browsers: ["last 8 version"] })
                            ]
                        }
                    },
                    {
                        loader: "sass-loader?outputStyle=expanded", // compiles Sass to CSS
                        options: {
                            includePaths: ["src/assets/scss"]
                        }
                    }, 
                ]
            }
        ]
    },
    // eval-source-map is faster for development
    devtool: '#cheap-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        new webpack.HotModuleReplacementPlugin(), //热加载模板webpack-hot-middleware
    ]
})

var htmlWebpackPlugins = [] // 多html对应多个js入口文件

Object.keys(webpackConfig.entry).forEach(function(name, i) {
    // https://github.com/ampedandwired/html-webpack-plugin
    htmlWebpackPlugins.push(new HtmlWebpackPlugin({
        filename: name + '/index.html',
        template: './src/' + name + '/app.html',
        chunks: [name],
        inject: true
    }))
})

webpackConfig.plugins = webpackConfig.plugins.concat(htmlWebpackPlugins)
module.exports = webpackConfig