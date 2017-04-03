const constants = require('./config/constants')
const logger    = require('koa-logger')
const Koa       = require('koa')
const koaBody   = require('koa-bodyparser')
const cors      = require('kcors')
const Raven     = require('raven')
const env       = require('./config/env')
const StatusRouter          = require('./routes').StatusRouter
const AuthenticationRouter  = require('./routes').AuthenticationRouter

// Sentry error catching
if (process.env.NODE_ENV === 'production') {
  Raven.config(env.sentry).install()
}

const app = new Koa()
app.use(async (ctx, next) => {
  try {
    await next()
    if (ctx.status === 404) ctx.throw(404)
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      if ((err > 499 && err < 600) || (err.status > 499 && err.status < 600)) {
        Raven.captureException(err, (error, eventId) => {
          console.log(JSON.stringify(error)) // eslint-disable-line no-console
          console.log(`Reported error ${eventId}`) // eslint-disable-line no-console
        })
      }
    }
    ctx.body = { message: err.message }
    ctx.status = err.status || 500
  }
})

app.use(logger())
app.use(koaBody({
  onerror: (err, ctx) => {
    console.log(JSON.stringify(err)) // eslint-disable-line no-console
    ctx.throw('MALFORMED_REQUEST', 422)
  }
}))
app.use(cors())
app.use(StatusRouter.routes())
app.use(AuthenticationRouter.routes())

if (!module.parent) {
  const port = process.env.PORT || 5000
  app.listen(port)
  console.log(`Server running. Listening on port ${port}.`) // eslint-disable-line no-console
  console.log(`Version: ${constants.version}`) // eslint-disable-line no-console
  console.log(`Environment: ${(process.env.NODE_ENV || 'dev')}`) // eslint-disable-line no-console
}

module.exports = app
