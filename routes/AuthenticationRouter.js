const AuthenticationHelper = require('../helpers/AuthenticationHelper')
const AuthenticationController = require('../controllers/AuthenticationController')
const Router = require('koa-router')

const AuthenticationRouter = new Router(
  {
    prefix: '/api/v1'
  }
)

AuthenticationRouter.use('/', AuthenticationHelper.authenticate)
AuthenticationRouter.get('/current_user', AuthenticationController.getCurrentUser)
AuthenticationRouter.post('/logout', AuthenticationController.logout)

module.exports = AuthenticationRouter
