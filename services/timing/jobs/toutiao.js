const koa2Req = require('koa2-request')
const request = require('request');
const logUtil = require('../../../utils/logUtil')
const md5 = require('md5')
const toutiaoServer = require('../../toutiaoInfo')
const puppeteer = require('puppeteer')
const utils = require('../../../utils/utils')
const cheerio = require('cheerio')

const toutiao = {
  start: async () => {
    
    //响应开始时间
    const start = new Date()
    //响应间隔时间
    let ms = 0
    const browser = await puppeteer.launch({timeout:0 }) //用指定选项启动一个Chromium浏览器实例。
    const page = await browser.newPage() //创建一个页面.
    await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
    await page.goto('https://www.toutiao.com/') //到指定页面的网址
    page.setViewport({
      width: 1920,
      height:2546,
    })
    let button = await page.$('a.active')
    await utils.sleep(3000)
    await button.click()
    await utils.sleep(3000)
    let scrollEnable = true
    let scrollStep = 1000 //每次滚动的步长
    await page.waitForSelector('.index-content .feed-infinite-wrapper ul li');
		while (scrollEnable) {
			await page.evaluate((scrollStep) => {
        let scrollTop = document.scrollingElement.scrollTop
        document.scrollingElement.scrollTop = scrollTop + scrollStep
      }, scrollStep)
      await utils.sleep(3000)
      let length = 0
      try {
        length = await page.$$eval('.index-content .feed-infinite-wrapper ul li', imgs => imgs.length)
      }catch(err) {
      }
      await utils.sleep(1000)
      if(length > 10) {
        scrollEnable = false
      }
    }
    const aHandle = await page.evaluateHandle(() => document.body);
    const resultHandle = await page.evaluateHandle(body => body.innerHTML, aHandle);
    let html = await resultHandle.jsonValue()
    const $ = cheerio.load(html)
    await resultHandle.dispose();
    await browser.close() //关闭已打开的页面，browser不能再使用。
    let list = $('.index-content .feed-infinite-wrapper ul')
    let result = []
    list.find('li .single-mode').each(function(item){
      let image_url = $(this).find('img').attr('src')
      if(image_url.indexOf('business') === -1 && image_url.indexOf('data:image') === -1) {
        result.unshift({
          image_url: $(this).find('img').attr('src'),
          title: $(this).find('.title-box a').text(),
          group_id: $(this).find('.title-box a').attr('href').split('/')[2]
        })
      }
    })
    ms = new Date() - start    
    logUtil.loggerJob('今日头条',result.length, 'https://www.toutiao.com/', ms)
    for (let item of result) {
      let flag = await toutiaoServer.getExistOne({group_id: item.group_id})
      if(!flag && item.image_url) {
        try {
          toutiaoServer.create({
            title: item.title,
            group_id: item.group_id,
            image_url: item.image_url,
            create_time: new Date()
          })
        }catch (err) {
          logUtil.logJobError('今日头条', result, err, ms)
        }
      }
    }
  },
  active: false
}

module.exports = {
  'toutiao': toutiao
}