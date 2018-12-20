const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const logUtil = require('./utils/logUtil')
const router = require('./controllers.js')()

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

app.use(json())

app.use(require('koa-static')(__dirname + '/client/dist'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  
  //响应开始时间
  const start = new Date()
  //响应间隔时间
  let ms = 0
  try {
    //开始进入到下一个中间件
    await next()

    ms = new Date() - start
    //记录响应日志
    logUtil.logResponse(ctx, ms)

  } catch (error) {
    
    ms = new Date() - start

    //记录异常日志
    logUtil.logError(ctx, error, ms)
  }
})

// routes
app.use(router)

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})


module.exports = app
