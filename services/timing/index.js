const paths = require('path')
const schedule = require('node-schedule')

/**
 * 遍历文件，返回文件数组
 * @param  {String}   路径
 * @return {Array}   文件数组
 */
let readFile = (path) => {
  let fs = require('fs')
  let files = fs.readdirSync(path)
  let jsFiles = files.filter((f) => { return f.endsWith('.js')})
  return jsFiles
}

let dir = paths.join(__dirname, './jobs')

/**
 * 跟据文件里的对象生成启动定时任务
 * @param  {String}   路径
 * @return {Object}   routers
 */
let setJobs = (path = dir) => {
  let rule1     = new schedule.RecurrenceRule();  
  let times1    = [1,6,11,16,21,26,31,36,41,46,51,56]
  rule1.second  = times1
  let jsFiles = readFile(path)
  for (let js of jsFiles) { 
    let mapping = require( path + '/' + js) //分别引入每个js文件
    for (let fucName in mapping) { // 遍历每个jobs文件中的方法
      mapping[fucName].active && schedule.scheduleJob("5 * * * * *",mapping[fucName].start)
      // mapping[fucName].active && mapping[fucName].start()
    } 
  }
}


module.exports =  setJobs