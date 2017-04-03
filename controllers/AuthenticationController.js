const UserSerializer = require('../serializers/UserSerializer')

class AuthenticationController {
  static async getCurrentUser (ctx) {
    ctx.body = ctx.state.currentUser.serialize(UserSerializer)
  }

  static async logout (ctx) {
    await ctx.state.currentUser.update({
      apiToken: null,
      active: false
    })
    ctx.status = 204
  }
}

module.exports = AuthenticationController
