const constants = require('./config/constants');

const logger  = require('koa-logger');
const Koa     = require('koa');
const app     = module.exports = new Koa();
const koaBody = require('koa-bodyparser');
const cors    = require('kcors');
const env     = require('./config/env');

// Sentry error catching
if (process.env.NODE_ENV === 'production') {
  var Raven     = require('raven');
  Raven.config(env.sentry).install();
}

const StatusRouter          = require('./routes').StatusRouter;
const AuthenticationRouter  = require('./routes').AuthenticationRouter;

app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.status === 404) ctx.throw(404)
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      if ((err > 499 && err < 600) || (err.status > 499 && err.status < 600)) {
        Raven.captureException(err, (err, eventId) => {
          console.log(JSON.stringify(err))
          console.log('Reported error ' + eventId)
        });
      }
    }
    ctx.body = { message: err.message };
    ctx.status = err.status || 500;
  }
});

app.use(logger());
app.use(koaBody({
  onerror: (err, ctx) => {
    console.log(JSON.stringify(err))
    ctx.throw('MALFORMED_REQUEST', 422);
  }
}));
app.use(cors())
app.use(StatusRouter.routes())
app.use(AuthenticationRouter.routes())

if (!module.parent) {
  var port = process.env.PORT || 5000;
  app.listen(port);
  console.log('Server running. Listening on port ' + port + '.');
  console.log('Version: ' + constants.version);
  console.log('Environment: ' + (process.env.NODE_ENV || 'dev'));
}

module.exports = app
