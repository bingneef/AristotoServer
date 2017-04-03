const UserFactory = require('./UserFactory')

class PlayerFactory {
  static async create () {
    // A player is created when a user is created
    const user = await UserFactory.create()
    const player = await user.getPlayer()
    return player
  }
}

module.exports = PlayerFactory
