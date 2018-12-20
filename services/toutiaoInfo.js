/**
 * 今日头条数据操作
 */

const validator = require('validator')
const toutiaoModel = require('../models/toutiaoInfo')

const toutiao = {

  /**
   * 插入一条数据
   * @param  {Object} toutiao 头条信息
   * @return {Object}         创建结果
   */
  async create( info ) {
    let result = await toutiaoModel.create(info)
    return result
  },

  /**
   * 查找所需头条信息 默认12条
   * @param  {Number}           需要的条数
   * @return {Object|null}      查找结果
   */
  async getAll(num = 12) {
    let resultData = await toutiaoModel.getAll(num)
    return resultData
  },

  /**
   * 查找存在用户信息
   * @param  {Object} formData  查找的表单数据
   * @return {Object|null}      查找结果
   */
  async getExistOne( formData ) {
    let resultData = await toutiaoModel.getExistOne({
      'group_id': formData.group_id
    })
    return resultData
  },

}

module.exports = toutiao