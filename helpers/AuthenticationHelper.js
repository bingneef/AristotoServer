const User = require('../models').User;
var AuthenticateHelper = function () {};

AuthenticateHelper.prototype.authenticate = async (ctx, next) => {
  try {
    var apiToken = ctx.request.header.authorization.split('=')[1];
  } catch (exception) {
    ctx.throw(401)
  };

  var user = await User.findOne({
    where: {
      apiToken: apiToken,
      active: true
    }
  })

  if (!user) ctx.throw(401)
  ctx.state.currentUser = user
  await next()
}

module.exports = new AuthenticateHelper();
