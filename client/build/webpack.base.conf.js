const path = require('path')
var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
var projectRoot = path.resolve(__dirname, '../')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')

var env = process.env.NODE_ENV

var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd
var entry = {}
function walk(dir) {
    dir = dir || '.'
    var directory = path.join(__dirname, '../src/pages', dir)
    fs.readdirSync(directory)
        .forEach(function(file) {
            var fullpath = path.join(directory, file)
            var stat = fs.statSync(fullpath)
            var extname = path.extname(fullpath)
            // 注：遍历到app.js则加入entry对象中，作为页面的入口js
            if (stat.isFile() && (file === 'app.js' || extname === '.js')) {
                var name = path.join('pages', dir)
                entry[name] = fullpath
            } else if (stat.isDirectory() && file !== 'build' && file !== 'include') {
                var subdir = path.join(dir, file)
                walk(subdir)
            }
        })
}

walk()
module.exports = {
  entry: entry,
  output: {
    path: config.build.assetsRoot,
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
  resolve: {
      extensions: ['.js', '.vue', '.scss'],
      alias: {
          'vue$': 'vue/dist/vue.esm.js', // 'vue/dist/vue.common.js' for webpack 1
          'src': path.resolve(__dirname, '../src'),
          'assets': path.resolve(__dirname, '../src/assets'),
          'components': path.resolve(__dirname, '../src/components'),
          'modules': path.resolve(__dirname, '../src/modules'),
          'config': path.resolve(__dirname, '../src/config'),
          'scss': path.resolve(__dirname, '../src/assets/scss'),
          'router': path.resolve(__dirname, '../src/router'),
          'utils': path.resolve(__dirname, '../src/utils'),
      },
  },
  module: {
        rules: [
      			{
                test: /\.js$/,
                use: 'babel-loader',
                include: projectRoot,
                exclude: /node_modules/
            }, 
            {
                test: /\.json$/,
                use: 'json-loader'
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            }, {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [
                  {
                    loader: 'url-loader', //url转base64
                    options: {
                      limit: 3072, // 3k
                      name: utils.assetsPath('assets/img/[name].[hash:7].[ext]')
                    }
                  }
                ]
            }, {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [
                  {
                    loader: 'url-loader',
                    options: {
                        limit: 3072, // 3k
                        name: utils.assetsPath('assets/fonts/[name].[hash:7].[ext]')
                    }
                  }
                ]
            }
        ]
  },
  plugins: [
    	new VueLoaderPlugin(), //新版vue-loader需要
    	//new webpack.HotModuleReplacementPlugin(), //热加载模板webpack-hot-middleware
  ]
};