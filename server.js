'use strict'

const Koa = require('koa')
const Router = require('koa-router')
const serveStatic = require('koa-serve-static')
const morgan = require('koa-morgan')

const app = new Koa()
const router = new Router()

// 加载静态文件
// 类似 express: `app.use('/static', express.static('public'));`
router
  .get('/static/:file', (ctx, next) => {
    ctx.req.url = ctx.params.file
    return serveStatic(`${__dirname}/public`)(ctx)
    .catch((err) => {
      ctx.res.statusCode = err ? (err.status || 502) : 404
      ctx.res.end(err ? err.stack : 'sorry!')
    })
  })

app
  .use(router.routes())
  .use(router.allowedMethods())

// 返回默认内容
app.use(ctx => {
  ctx.body = 'Hello Koa and Postgres!\n' + 'Thanks StuQ Team!'
})

// 监听 3000 端口
app.listen(3000)
