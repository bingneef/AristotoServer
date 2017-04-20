const path                  = require('path')
const Koa                   = require('./node_modules/koa')
const logger                = require('./node_modules/koa-logger')
const koaBody               = require('./node_modules/koa-bodyparser')
const views                 = require('koa-views')
const convert               = require('koa-convert')
const cors                  = require('./node_modules/kcors')
const Raven                 = require('./node_modules/raven')
const constants             = require('./config/constants')
const env                   = require('./config/env')
const StatusRouter          = require('./routes').StatusRouter
const OauthRouter           = require('./routes').OauthRouter
const AuthenticationRouter  = require('./routes').AuthenticationRouter
const TeamRouter            = require('./routes').TeamRouter
const RoundRouter           = require('./routes').RoundRouter
const PredictionRouter      = require('./routes').PredictionRouter

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

app.use(convert(views(path.join(__dirname, '/views'), { extension: 'jade' })));
app.use(logger())
app.use(koaBody({
  onerror: (err, ctx) => {
    console.log(JSON.stringify(err)) // eslint-disable-line no-console
    ctx.throw('MALFORMED_REQUEST', 422)
  }
}))
app.use(OauthRouter.routes());
app.use(cors())
app.use(StatusRouter.routes())
app.use(AuthenticationRouter.routes())
app.use(TeamRouter.routes())
app.use(RoundRouter.routes())
app.use(PredictionRouter.routes())

if (!module.parent) {
  const port = process.env.PORT || 5000
  app.listen(port)
  console.log(`Server running. Listening on port ${port}.`) // eslint-disable-line no-console
  console.log(`Version: ${constants.version}`) // eslint-disable-line no-console
  console.log(`Environment: ${(process.env.NODE_ENV || 'dev')}`) // eslint-disable-line no-console
}

module.exports = app
