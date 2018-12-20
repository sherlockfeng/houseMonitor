let log4js = require('log4js')

const log_config = require('../config/logConfig')

//加载配置文件
log4js.configure(log_config)

let logUtil = {}

const errorLogger = log4js.getLogger('error')
const jobErrorLogger = log4js.getLogger('jobError')
const jobLogger = log4js.getLogger('jobLog')
const resLogger = log4js.getLogger()

//封装错误日志
logUtil.logError = (ctx, error, resTime) => {
	if (ctx && error) {
		errorLogger.error(formatError(ctx, error, resTime))
	}
}

//封装响应日志
logUtil.logResponse = (ctx, resTime) => {
	if (ctx) {
		resLogger.info(formatRes(ctx, resTime))
	}
}

//封装定时任务错误日志
logUtil.logJobError = (tips, content, error, resTime) => {
	if (tips) {
		jobErrorLogger.error(formatJobError(tips, content, error, resTime))
	}
}

//封装定时任务日志
logUtil.loggerJob = (tips, num, url, resTime) => {
	if (tips) {
		jobLogger.info(formatJob(tips, num, url, resTime))
	}
}

//格式化定时任务日志
let formatJob = (tips = '', num = 0, url = '', resTime) => {
	let logText = new String()

	//信息开始
	logText += "\n" + "*************** jobInfo log start ***************" + "\n"

	//添加任务名称
	logText += "定时任务名称： " + tips + "\n"

	//添加数据条数
	logText += "获取到数据 " + num + " 条"+ "\n"

	//添加url	
	logText += "请求url  " + url + "\n"

	//添加任务时间
	logText += "耗时： " + resTime + "\n"

	//信息结束
	logText += "*************** jobInfo log end ***************" + "\n"
	return logText
}

//格式化定时任务错误日志
let formatJobError = (tips = '', content = '', error, resTime) => {
	let logText = new String()

	//错误信息开始
	logText += "\n" + "*************** jobError log start ***************" + "\n"

	//添加错误任务名字
	logText += "定时任务名称： " + tips + "\n"

	//添加错误任务时间
	logText += "耗时： " + resTime + "\n"

	//添加错误任务返回内容
	logText += "内容： " + content.toString() + "\n"

	//错误名称
	logText += "err name: " + err.name + "\n"

	//错误信息
	logText += "err message: " + err.message + "\n"

	//错误详情
	logText += "err stack: " + err.stack + "\n"

	//错误信息结束
	logText += "*************** jobError log end ***************" + "\n"
	return logText
}

//格式化响应日志
let formatRes = (ctx, resTime) => {
	let logText = new String()

	//响应日志开始
	logText += "\n" + "*************** response log start ***************" + "\n"

	//添加请求日志
	logText += formatReqLog(ctx.request, resTime)

	//响应状态码
	logText += "response status: " + ctx.status + "\n"

	//响应内容
	logText += "response body: " + "\n" + JSON.stringify(ctx.body) + "\n"

	//响应日志结束
	logText += "*************** response log end ***************" + "\n"

	return logText

}

//格式化错误日志
let formatError = (ctx, err, resTime) => {
	let logText = new String()

	//错误信息开始
	logText += "\n" + "*************** error log start ***************" + "\n"

	//添加请求日志
	logText += formatReqLog(ctx.request, resTime)

	//错误名称
	logText += "err name: " + err.name + "\n"
	//错误信息
	logText += "err message: " + err.message + "\n"
	//错误详情
	logText += "err stack: " + err.stack + "\n"

	//错误信息结束
	logText += "*************** error log end ***************" + "\n"
	return logText
}

//格式化请求日志
let formatReqLog = (req, resTime) => {

    let logText = new String()

    let method = req.method
    //访问方法
    logText += "request method: " + method + "\n"

    //请求原始地址
    logText += "request originalUrl:  " + req.originalUrl + "\n"

    //客户端ip
    logText += "request client ip:  " + req.ip + "\n"

    //开始时间
    let startTime
    //请求参数
    if (method === 'GET') {
        logText += "request query:  " + JSON.stringify(req.query) + "\n"
        // startTime = req.query.requestStartTime
    } else {
        logText += "request body: " + "\n" + JSON.stringify(req.body) + "\n"
        // startTime = req.body.requestStartTime
    }
    //服务器响应时间
    logText += "response time: " + resTime + "\n"

    return logText
}

module.exports = logUtil