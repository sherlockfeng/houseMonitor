const dbUtils = require('../utils/dbUtil')

const ajk = {

  /**
   * 数据库创建数据
   * @param  {Object} model 用户数据模型
   * @return {Object}       mysql执行结果
   */
  async insert ( model ) {
    let result = await dbUtils.insertData( 'houseSecOuterData', model )
    return result
  },

  /**
   * 数据库更新数据
   * @param  {Object} model 用户数据模型
   * @return {Object}       mysql执行结果
   */
  async update ( model, house_id ) {
    let _sql = `
    UPDATE  houseSecOuterData set
    WHERE house_id="${house_id}"
      limit 1`
    let result = await dbUtils.query( _sql )
    return result
  },

  /** 
   * @return {Object}  mysql执行结果
  */
  async getConfig () {
    let _sql = `
    SELECT * FROM houseConfig 
      WHERE active_ajk_sec = 1`
    let result = await dbUtils.query(_sql)
    return result
  }
}

module.exports = ajk