const UserSerializer = require('../serializers/UserSerializer');

const AuthenticationController = () => {}

AuthenticationController.prototype.getCurrentUser = async (ctx) => {
  ctx.body = ctx.state.currentUser.serialize(UserSerializer)
}

AuthenticationController.prototype.logout = async (ctx) => {
  await ctx.state.currentUser.update({
    apiToken: null,
    active: false
  });
  ctx.status = 204
}

module.exports = new AuthenticationController()
