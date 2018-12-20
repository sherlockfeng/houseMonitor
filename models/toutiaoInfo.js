const dbUtils = require('../utils/dbUtil')

const toutiao = {

  /**
   * 数据库创建数据
   * @param  {Object} model 用户数据模型
   * @return {Object}       mysql执行结果
   */
  async create ( model ) {
    let result = await dbUtils.insertData( 'toutiaoInfo', model )
    return result
  },

  /**
   * 查找一个存在的数据
   * @param  {obejct} options 查找条件参数
   * @return {Object|null}        查找结果
   */
  async getExistOne(options ) {
    let _sql = `
    SELECT * from toutiaoInfo
      where group_id="${options.group_id}"
      limit 1`
    let result = await dbUtils.query( _sql )
    if ( Array.isArray(result) && result.length > 0 ) {
      result = result[0]
    } else {
      result = null
    }
    return result
  },

  /**
   * 查找所需数量用户数据
   * @param  {Number}
   * @return {Object|null}        查找结果
   */
  async getAll(num) {
    let _sql = `SELECT * from toutiaoInfo order by create_time desc limit ${num}`
    let result = await dbUtils.query( _sql )
    return result
  },

}


module.exports = toutiao