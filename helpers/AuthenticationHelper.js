const User = require('../models').User

class AuthenticationHelper {
  static async authenticate (ctx, next) {
    let apiToken;
    try {
      apiToken = ctx.request.header.authorization.split('=')[1];
    } catch (exception) {
      ctx.throw(401)
    }

    const user = await User.findOne({
      where: {
        apiToken,
        active: true
      }
    })

    if (!user) ctx.throw(401)
    ctx.state.currentUser = user
    await next()
  }
}

module.exports = AuthenticationHelper
