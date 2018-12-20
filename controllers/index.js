let index = async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
}

let string = async (ctx, next) => {
  ctx.body = 'koa2 string'
}

module.exports = { 
  'Get /': index, 
  'Get /string': string 
}
