const userServer = require('../services/userInfo')

/**
 * 获取所有用户数据
 * @param  {obejct} ctx 上下文对象
 * @return {object}      查询结果
 */
let users = async (ctx, next) => {
  let data = await userServer.getAll()
  let result = {
    success: false,
    message: '',
    data,
    code: ''
  }
  ctx.body = result
}

module.exports = {
  'Get /users': users
}
