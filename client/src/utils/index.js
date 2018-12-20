import axios from 'axios'
import { Modal } from 'iview'

const Utils = {
	/**
	 * http请求封装
	 * @param {String} url
	 * @param {Object} params
	 * @param {Function} callback
	 * @param {Function} errorback
	 * @return {Object} response
	 */
	get: (url, params, callback, errorback) => {
		// let domain = 'http://rapapi.org/mockjsdata/22461'
		let domain = ''
		//通用参数处理
		let transParams = () => {
		}
		transParams();
		axios.get(domain + url, {
				headers: {
						'X-Requested-With': 'XMLHttpRequest'
				},
				timeout: 10000,
				params,
		}).then((json) => {
				let {code,message} = json.data
				if (code == 0){  
					callback && callback(json.data)
				} else {
					errorback ? errorback(error) : Modal.info({title: '接口异常',content:message})
					setTimeout(()=>{
							Modal.remove()
					},1000)
				}
		}).catch((error) => {
				if (error.message.indexOf('timeout') > -1) { //超时提示
					Modal.info({
							title: '请求超时',
							content: '请求超时，请稍后再试',
					})
					setTimeout(()=>{
							Modal.remove()
					},1000)
				} else if (error.response && error.response.status > 400){ //status 404,502这种提示
					Modal.info({
							title: '网络故障',
							content: '网络故障' + error.response.status + '，请稍后再试',
					})
					setTimeout(()=>{
							Modal.remove()
					},1000)
				} else{
						console.log(error)
				}
		})
	},

	/**
	 * 从url中获取参数
	 * @param {String} paramName
	 * @return {String} result
	 */
	getQueryStringByName: (paramName) => {
		let result = location.search.match(new RegExp('[\?\&]' + paramName + '=([^\&]+)', 'i'));
		if (result == null || result.length < 1) {
				return ''
		}
		return result[1]
	},
}

export default Utils