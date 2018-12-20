var utils = require('./utils')
var config = require('../config')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxy = require('express-http-proxy')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
    // Define HTTP proxies to your custom API backend
    // https://github.com/chimurai/http-proxy-middleware

const server = express();
const compiler = webpack(webpackConfig);

//自动编译
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
})

//热更新，自动刷新
var hotMiddleware = require('webpack-hot-middleware')(compiler)

var ipAddr = 'localhost:3000'//huidu
server.use('/api', proxy(ipAddr, {
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        proxyReqOpts.headers['Host'] = 'localhost'
        return proxyReqOpts
    },
    proxyReqPathResolver: function(req) {
        return '/api' + require('url').parse(req.url).path
    }
}))

server.use(devMiddleware);
server.use(hotMiddleware);
 
module.exports = server.listen(port, function(err) {
    if (err) {
        console.log(err)
        return
    }
    var uri = 'http://localhost:' + port
    console.log('Listening at ' + uri + '\n')

    // when env is testing, don't need open it
    if (process.env.NODE_ENV !== 'testing') {
        //opn(uri)
    }
})