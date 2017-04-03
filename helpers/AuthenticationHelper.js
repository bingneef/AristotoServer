const User = require('../models').User

const AuthenticateHelper = () => {}

AuthenticateHelper.prototype.authenticate = async (ctx, next) => {
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

module.exports = new AuthenticateHelper()
