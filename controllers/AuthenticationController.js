const Sequelize             = require('sequelize');
const UserSerializer        = require('../serializers/UserSerializer');

var AuthenticationController = function () {};

AuthenticationController.prototype.getCurrentUser = async (ctx, next) => {
  ctx.body = ctx.state.currentUser.serialize(UserSerializer)
}

AuthenticationController.prototype.logout = async (ctx, next) => {
  var user = await ctx.state.currentUser.update({
    apiToken: null,
    active: false
  });
  ctx.status = 204
}

module.exports = new AuthenticationController();
