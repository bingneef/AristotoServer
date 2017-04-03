// eslint-disable-next-line import/no-extraneous-dependencies, global-require
const faker = require('../../node_modules/faker')
const User = require('../../models').User

class UserFactory {
  static params () {
    return {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      avatarUrl: faker.image.imageUrl(),
      email: faker.internet.email(),
      password: 'testtest',
      active: true
    }
  }

  static async create () {
    const user = await User.create(UserFactory.params())
    return user
  }
}

module.exports = UserFactory
