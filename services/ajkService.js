/**
 * 今日头条数据操作
 */

const validator = require('validator')
const ajkModel = require('../models/ajkModel')

const ajk = {

  /**
   * 插入一条数据
   * @param  {Object} ajk     房屋信息
   * @return {Object}         创建结果
   */
  async insert( data ) {
    let result = await ajkModel.insert(data)
    return result
  },

  /**
   * 更新一条数据
   * @param  {Object} ajk     房屋信息
   * @return {Object}         创建结果
   */
  async update (info) {
    let result = await ajkModel.update(data)
    return result
  },

  /** 
   * 查询需要抓取的城市和配置
   * @return {Object}        需要抓取的城市配置
  */
  async getConfig () {
    let result = await ajkModel.getConfig()
    return result
  }

}

module.exports = ajk