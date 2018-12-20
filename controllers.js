/**
 * 遍历文件，返回文件数组
 * @param  {string}   路径
 * @return {array}   文件数组
 */
let readFile = (path) => {
  let fs = require('fs')
  let files = fs.readdirSync('./'+path)
  let jsFiles = files.filter((f) => { return f.endsWith('.js')})
  return jsFiles
}

/**
 * 跟据文件里的对象生成routers
 * @param  {string}   路径
 * @return {object}   routers
 */
let setRouter = (path) => {
  // 声明路由 
  let router = require('koa-router')(); 
  let jsFiles = readFile(path); 
  for (let js of jsFiles) { 
    let mapping = require( __dirname + '/' + path + '/' + js) //分别引入每个js文件 
    for (let url in mapping) { // 遍历每个controller文件中的路由 
      if(url.startsWith('Get')) { // method: get 
        router.get(url.replace('Get ', ''), mapping[url])
      }else if (url.startsWith('Post'), mapping[url]) { // method: post 
        router.post(url.replace('Post ', ''), mapping[url])
      }else { // 非路由的 
        console.log('this is not router file')
      } 
    } 
  } 
  return router.routes()
}

module.exports =  (path) => { 
  return setRouter( path || 'controllers')
}