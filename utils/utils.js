const Utils = {
  /**
   * 格式化时间
   * @param  {string}  需要的时间格式 yyyy-MM-dd hh:mm:ss
   * @param  {number}  可以设置格式化几天之前或几天之后的时间
   * @return {string}  查询结果
   */
  getTime: (fmt, before = 0) => {
    let date = new Date()
    date.setTime(date.getTime() + before * 24 * 60 * 60 * 1000)
    let o = { 
      "M+" : date.getMonth() + 1,                 //月份 
      "d+" : date.getDate(),                    //日 
      "h+" : date.getHours(),                   //小时 
      "m+" : date.getMinutes(),                 //分 
      "s+" : date.getSeconds(),                 //秒 
      "q+" : Math.floor((date.getMonth()+3)/3), //季度 
      "S"  : date.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
    for(var k in o) {
      if(new RegExp("("+ k +")").test(fmt)){
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
    }
    return fmt; 
  },

  
  sleep: (delay = 1000) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(1)
        } catch (e) {
          reject(0)
        }
      }, delay)
    })
  },

  /**
   * 判断是否为ip或者ip加端口或者端口
   * @param  {string}  需要校验d字符串
   * @return {string}  查询结果 ip 返回 ip ,port 返回port ip:port 返回ipWithProt 失败返回空字符串
   */
  isIpOrPortOrIpWithPort: (str) => {
    let result = ''
    const pattIp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    const pattIpWithPort = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/
    const pattProt = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/
    if(str.indexOf(':') !== -1) {
      pattIpWithPort.test(str) && (result = 'ipWithPort')
      return result
    }
    if(str.indexOf('.') !== -1) {
      pattIp.test(str) && (result = 'ip')
      return result
    }
    pattProt.test(str) && (result = 'port')
    return result
  }
}

module.exports = Utils