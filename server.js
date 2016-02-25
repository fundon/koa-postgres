'use strict'

const Koa = require('koa')
const Router = require('koa-router')
const serveStatic = require('koa-serve-static')
const morgan = require('koa-morgan')
const nunjucks = require('nunjucks')

const app = new Koa()
const router = new Router()

// 请求日志中间件
app.use(morgan('dev'))

// 加载静态文件
// 类似 express: `app.use('/static', express.static('public'));`
// http://127.0.0.1:3000/static/bundle.js
router
  .get('/static/:file', (ctx, next) => {
    ctx.req.url = ctx.params.file
    return serveStatic(`${__dirname}/public`)(ctx)
    .catch((err) => {
      ctx.res.statusCode = err ? (err.status || 502) : 404
      ctx.res.end(err ? err.stack : 'sorry!')
    })
  })

router
  .get('/stuq', (ctx, next) => {
    // context
    ctx.body = 'Hello StuQ!'
  })

app
  .use(router.routes())
  .use(router.allowedMethods())

// render
app.context.render = function render(view, options) {
  return new Promise((resolve, reject) => {
    nunjucks.render(`${__dirname}/views/${view}`, options, (err, res) => {
      err ? reject(err) : resolve(res)
    })
  })
}

// 返回默认内容
app.use(ctx => {
  return ctx.render('index.html', { title: '大家好!' }).then((body) => { ctx.body = body })
})

// 监听 3000 端口
app.listen(3000)
