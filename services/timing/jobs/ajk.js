const logUtil = require('../../../utils/logUtil')
const ajkServer = require('../../ajkService')
const puppeteer = require('puppeteer')
const utils = require('../../../utils/utils')
const cheerio = require('cheerio')


const ajk = {
  active: false,
  start: async () => {
    const cityActive = await ajkServer.getConfig()
    let cityDetailUrl = []
    
    //脚本开始时间
    const start = new Date()
    //脚本间隔时间
    let ms = 0

    let isInYZ = async($) => {
      return ($('#ISDCaptcha .dvc-slider__tips') && $('#ISDCaptcha .dvc-slider__tips').text() === "向右滑动滑块填充拼图")
    }

    let getHouseDetail = async (urlArray, cityConfig) => {
      for(let i = 0; i < urlArray.length; i++) {
        await utils.sleep(i%3 * 3000 + 3000)
        await page.goto(urlArray[i])
        let aHandle = await page.evaluateHandle(() => document.body)
        let resultHandle = await page.evaluateHandle(body => body.innerHTML, aHandle)
        let html = await resultHandle.jsonValue()
        let $ = cheerio.load(html)
        if(isInYZ($)) {
          await browser.close()
          return
        }
        await resultHandle.dispose()
        let data = {}
        data.title = $('h3.long-title').text().trim().replace(/\n/g, '').replace(/\t/g, '')
        data.price = $('.light.info-tag').find('em').text().trim().replace(/\n/g, '').replace(/\t/g, '')
        data.link_url = urlArray[i].split('?')[0]
        data.house_id = urlArray[i].split('?')[0].split('view/')[1]
        data.city_id = cityConfig.city_id
        data.city_name = cityConfig.city_name
        data.city_name = cityConfig.city_name
        $('.houseInfo-detail-list').find('li').each((i, item) => {
          let label = $(item).find('.houseInfo-label').text().trim()
          let content = $(item).find('.houseInfo-content').text().trim().replace(/\n/g, '').replace(/\t/g, '')
          if(label.indexOf('房屋单价') !== -1) {
            data.uni_price = content
          }
          if(label.indexOf('房屋户型') !== -1) {
            data.house_type = content
          }
          if(label.indexOf('楼层') !== -1) {
            data.house_floor = content
          }
          if(label.indexOf('年代') !== -1) {
            data.build_time = content
          }
          if(label.indexOf('位置') !== -1) {
            data.address = content
          }
          if(label.indexOf('小区') !== -1) {
            data.community = content
          }
          if(label.indexOf('产权年限') !== -1) {
            data.property_year = content
          }
          if(label.indexOf('产权性质：') !== -1) {
            data.property_type = content
          }
          if(label.indexOf('建筑面积：') !== -1) {
            data.floor_area = content
          }
          if(label.indexOf('房屋朝向：') !== -1) {
            data.face_to = content
          }
          if(label.indexOf('配套电梯：') !== -1) {
            data.elevator = content
          }
          if(label.indexOf('参考首付：') !== -1) {
            data.down_payments = content
          }
          if(label.indexOf('装修程度：') !== -1) {
            data.decoration = content
          }
          if(label.indexOf('参考月供：') !== -1) {
            data.monthly_supply = content
          }
        })
        let des = ''
        $('.houseInfo-item-desc').each((i, item) => {
          let desStr = $(item).text()
          if(i !== $('.houseInfo-item-desc').length - 1) {
            des += desStr.trim().replace(/\n/g, '').replace(/\t/g, '') + '|'
          }
        })
        data.source = 'ajk'
        data.describe = des
        data.create_time = new Date()
        await ajkServer.insert(data)
        await utils.sleep(i%3 * 3000 + 3000)
        await page.goBack()
      }
    }

    const browser = await puppeteer.launch({timeout:15000,headless:false,args:['--no-sandbox','--disable-setuid-sandbox','--proxy-server=218.14.115.211:3128']}) //用指定选项启动一个Chromium浏览器实例。
    const page = await browser.newPage() //创建一个页面.
    await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');

    for(let i = 0; i < cityActive.length; i++) {
      cityDetailUrl = []
      await page.goto(cityActive[i].ajk_sec_url)
      // page.setViewport({
      //   width: 1920,
      //   height:2546,
      // })
      let aHandle = await page.evaluateHandle(() => document.body)
      let resultHandle = await page.evaluateHandle(body => body.innerHTML, aHandle)
      let html = await resultHandle.jsonValue()
      let $ = cheerio.load(html)
      await resultHandle.dispose()
      await utils.sleep(3000)
      if(isInYZ($)) {
        await browser.close()
        return
      }
      $('#houselist-mod-new').find('li.list-item').each((j, item)=>{
        cityDetailUrl.push($(item).find('a').attr('href'))
      })
      await getHouseDetail(cityDetailUrl, cityActive[i])
      await utils.sleep(i * 3000)
    }

    await browser.close() //关闭已打开的页面，browser不能再使用。

  }
}

module.exports = {
  'ajk': ajk
}