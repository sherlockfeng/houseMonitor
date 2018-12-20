const path = require('path')

//日志根目录
const baseLogPath = path.resolve(__dirname, '../logs')

//错误日志目录
const errorPath = "/error"

//错误日志文件名
const errorFileName = "error"

//错误日志输出完整路径
const errorLogPath = baseLogPath + errorPath + "/" + errorFileName


//响应日志目录
const responsePath = "/response"

//响应日志文件名
const responseFileName = "response"

//响应日志输出完整路径
const responseLogPath = baseLogPath + responsePath + "/" + responseFileName


//定时任务错误日志目录
const jobErrorPath = "/jobError"

//定时任务错误日志文件名
const jobErrorFileName = "jobError"

//定时任务错误日志输出完整路径
const jobErrorLogPath = baseLogPath + jobErrorPath + "/" + jobErrorFileName



//定时任务信息日志目录
const jobLogPath = "/jobLog"

//定时任务错误日志文件名
const jobLogFileName = "jobLog"

//定时任务错误日志输出完整路径
const jobLogLogPath = baseLogPath + jobLogPath + "/" + jobLogFileName

module.exports = {

	appenders: {
		errorLogger: {
			type: "dateFile",                   //日志类型
			filename: errorLogPath,             //日志输出位置
			alwaysIncludePattern: true,          //是否总是有后缀名
			pattern: "-yyyy-MM-dd.log",      //后缀，每小时创建一个新的日志文件
			path: errorPath                     //自定义属性，错误日志的根目录
		},
		jobErrorLogger: {
			type: "dateFile", 
			filename: jobErrorLogPath,
			alwaysIncludePattern: true,
			pattern: "-yyyy-MM-dd.log",
			path: jobErrorPath  
		},
		jobLogger: {
			type: "dateFile", 
			filename: jobLogLogPath,
			alwaysIncludePattern: true,
			pattern: "-yyyy-MM-dd-hh.log",
			path: jobLogPath  
		},
		resLogger: {
			type: "dateFile",
			filename: responseLogPath,
			alwaysIncludePattern: true,
			pattern: "-yyyy-MM-dd-hh.log",
			path: responsePath  
		}
	},
	categories: {
		error: {
			appenders: [
				"errorLogger"
			],
			level: 'error'
		},
		jobError: {
			appenders: [
				"jobErrorLogger"
			],
			level: 'error'
		},
		jobLog: {
			appenders: [
				"jobLogger"
			],
			level: 'info'
		},
		default: {
			appenders: [
				"resLogger"
			],
			level: "info"
		}
	}
}