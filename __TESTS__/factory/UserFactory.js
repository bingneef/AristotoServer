// eslint-disable-next-line import/no-extraneous-dependencies, global-require
const faker = require('../../node_modules/faker')
const User = require('../../models').User

class UserFactory {
  static params (override) {
    let active = override.active
    if (active === undefined) {
      active = true
    }

    return {
      firstName: override.firstName || faker.name.firstName(),
      lastName: override.lastName || faker.name.lastName(),
      avatarUrl: override.avatarUrl || faker.image.imageUrl(),
      email: override.email || faker.internet.email(),
      password: override.password || 'testtest',
      active
    }
  }

  static async create (params) {
    const user = await User.create(UserFactory.params(params || {}))
    return user
  }
}

module.exports = UserFactory
