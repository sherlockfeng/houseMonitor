const logUtil = require('../../../utils/logUtil')
const request = require('request')
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const utils = require('../../../utils/utils')
var iconv = require('iconv-lite');
const rp = require('request-promise');


const ipProxy = {
  active: false,
  start: async () => {
    //脚本开始时间
    const start = new Date()
    //脚本间隔时间
    let ms = 0
    let ips = []
    let avalibleIps = []

    
    async function testIps(url){
      let targetOptions = {
        method: 'GET',
        uri: 'https://wuhan.anjuke.com/sale/',
        timeout: 8000,
        encoding: null,
      }
      targetOptions.proxy = `http://${url}`
      console.log(targetOptions.proxy)
      await rp(targetOptions).then((body) => {
        bodyStr = body.toString()
        if(bodyStr.indexOf('对不起，您要浏览的网页可能被删除，重命名或者暂时不可用') === -1 && bodyStr.indexOf('系统检测到您正在使用网页抓取工具访问安居客网站，请卸载删除后访问') === -1) {
          avalibleIps.push(url)
        }
      }).catch((e) => {
        console.error("====")
      })
      
    }

    let getIps  = async () => {
      const browserForProxy = await puppeteer.launch({timeout:30000}).catch((e) => {
        console.log(e)
      }) //用指定选项启动一个Chromium浏览器实例。
      const pageProxy = await browserForProxy.newPage()
      await pageProxy.goto('http://www.xicidaili.com/nn/')
      let aHandle = await pageProxy.evaluateHandle(() => document.body)
      let resultHandle = await pageProxy.evaluateHandle(body => body.innerHTML, aHandle)
      let html = await resultHandle.jsonValue()
      let $ = cheerio.load(html)
      await resultHandle.dispose()
      let str = ''
      let ipWithPort = ''
      $('#body #ip_list tbody td').each((i,item)=> {
        str = $(item).text().trim()
        if(utils.isIpOrPortOrIpWithPort(str) === 'ip') {
          ipWithPort = str
        }
        if(utils.isIpOrPortOrIpWithPort(str) === 'port') {
          ipWithPort = ipWithPort + ':' + str
          if(ipWithPort !=='106.75.226.36:808') {
            ips.push(ipWithPort)
          }
        }
      })
      await browserForProxy.close()
    }


    // await getIps()
    // console.log(ips)
    // // ips = ['106.75.226.36:808']
    // async function checkIps(ips) {
    //   console.log(ips.length)
    //   for(let i = 0; i < ips.length; i++) {
    //     await testIps(ips[i])
    //   }
    // }
    // await checkIps(ips)
    // console.log(avalibleIps)

    // return

    const browser = await puppeteer.launch({timeout:30000,headless:false,args:['--no-sandbox','--disable-setuid-sandbox','--proxy-server=182.18.13.149:53281']}) //用指定选项启动一个Chromium浏览器实例。
    const page = await browser.newPage() //创建一个页面.
    await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
    await page.goto('https://wuhan.anjuke.com/sale/',{timeout:60000}).catch(async (e) => {
      console.log(e)
      page.reload()
      // await browser.close()
    })
    page.reload()

    // await browser.close()


  }

}

module.exports = {
  'ipProxy': ipProxy
}