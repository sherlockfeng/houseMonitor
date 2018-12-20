const koa2Req = require('koa2-request')
const utils = require('../utils/utils')
const logUtil = require('../utils/logUtil')
const md5 = require('md5')
const toutiaoService = require('../services/toutiaoInfo')

/**
 * 获取知乎日报热门数据
 * @param  {Obejct} ctx 上下文对象
 * @return {Object}      查询结果
 */
const zhihu = async (ctx, next) => {
  let result = {
    success: false,
    message: '获取知乎日报接口失败',
    data: {},
    code: -10000
  }
  const start = new Date()
  let ms = 0
  try {
    let data = await koa2Req('https://news-at.zhihu.com/api/4/news/latest')
    data = JSON.parse(data.body)
    if(data.stories.length < 12) {
      let s1 = utils.getTime('yyyyMMdd')
      let lastData = await koa2Req(`https://news-at.zhihu.com/api/4/news/before/${s1}`)
      data.stories = data.stories.concat(JSON.parse(lastData.body).stories.slice(0, 12 - data.stories.length))
    }else if(data.stories.length > 12) {
      data.stories = data.stories.slice(0, 12)
    }
    result.data = data
    result.success = true
    result.message = 'success'
    result.code = 0
  } catch (err) {
    ms = new Date() - start
    //记录异常日志
    logUtil.logError(ctx, err, ms)
  }
  ctx.body = result
}

/**
 * 获取知乎日报热门数据
 * @param  {Obejct} ctx 上下文对象
 * @param  {String} id  文章id
 * @return {Object}     查询结果
 */
const zhihuArticle = async (ctx, next) => {
  let result = {
    success: false,
    message: '获取知乎文章接口失败',
    data: {},
    code: -10000
  }
  const start = new Date()
  let ms = 0
  let id = ctx.params.id
  try {
    let data = await koa2Req(`https://news-at.zhihu.com/api/4/news/${id}`)
    data = JSON.parse(data.body)
    result.data = data
    result.success = true
    result.message = 'success'
    result.code = 0
  } catch (err) {
    ms = new Date() - start
    //记录异常日志
    logUtil.logError(ctx, err, ms)
  }
  ctx.body = result
}

/**
 * 获取今日头条推荐数据
 * @param  {Obejct} ctx 上下文对象
 * @return {Object}      查询结果
 */
const toutiao = async (ctx, next) => {
  let result = {
    success: false,
    message: '获取今日头条接口失败',
    data: {},
    code: -10000
  }
  const start = new Date()
  let ms = 0
  try {
    let data = await toutiaoService.getAll()
    result.data = data
    result.success = true
    result.message = 'success'
    result.code = 0
  } catch (err) {
    ms = new Date() - start
    //记录异常日志
    logUtil.logError(ctx, err, ms)
  }
  ctx.body = result
}

module.exports = {
  'Get /api/zhihu': zhihu,
  'Get /api/zhihu/article/:id': zhihuArticle,
  'Get /api/toutiao': toutiao,
}
