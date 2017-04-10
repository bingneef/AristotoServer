const Router                = require('koa-router')
const TeamController        = require('../controllers/TeamController')
const AuthenticationHelper  = require('../helpers/AuthenticationHelper')

const TeamRouter = new Router(
  {
    prefix: '/api/v1/teams'
  }
)

TeamRouter.use('/', AuthenticationHelper.authenticate)
TeamRouter.get('/', TeamController.getTeams)

module.exports = TeamRouter
