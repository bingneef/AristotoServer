const UserFactory = require('./UserFactory')
var PlayerFactory = function () {};

PlayerFactory.prototype.create = async () => {
  // A player is created when a user is created
  var user = await UserFactory.create()
  var player = await user.getPlayer()
  return player
}

module.exports = new PlayerFactory();
