const passport = require('./../oauth')
const env      = require('./../config/env')

class OauthController {
  static async facebookCallback (ctx, next) {
    await passport.authenticate('facebook', async (err, user) => {
      if (err) {
        ctx.throw(422)
      }

      await ctx.render('oauth_callback', {
        apiToken: user.apiToken,
        origin: env.frontEndOrigin
      })
    })(ctx, next)
  }

  static async googleCallback (ctx, next) {
    await passport.authenticate('google', async (err, user) => {
      if (err) {
        ctx.throw(422)
      }

      await ctx.render('oauth_callback', {
        apiToken: user.apiToken,
        origin: env.frontEndOrigin
      })
    })(ctx, next)
  }
}

module.exports = OauthController
