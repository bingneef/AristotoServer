const OauthController = require('../controllers/OauthController')
const Router = require('koa-router')
const passport = require('./../oauth')

const OauthRouter = new Router(
  {
    prefix: '/auth'
  }
)

OauthRouter.get('/facebook', passport.authenticate('facebook', { display: 'popup' }))
OauthRouter.get('/facebook/callback', OauthController.facebookCallback)
OauthRouter.get('/google', passport.authenticate('google'))
OauthRouter.get('/google/callback', OauthController.googleCallback)

module.exports = OauthRouter
