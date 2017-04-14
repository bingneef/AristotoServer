const Router                = require('koa-router')
const RoundController       = require('../controllers/RoundController')
const RoundHelper           = require('../helpers/RoundHelper')
const AuthenticationHelper  = require('../helpers/AuthenticationHelper')

const RoundRouter = new Router(
  {
    prefix: '/api/v1/rounds'
  }
)

RoundRouter.use('/', AuthenticationHelper.authenticate)
RoundRouter.get('/', RoundController.getRounds)
RoundRouter.use('/:id', RoundHelper.getRound)
RoundRouter.get('/:id/matches', RoundController.getMatches)

module.exports = RoundRouter
