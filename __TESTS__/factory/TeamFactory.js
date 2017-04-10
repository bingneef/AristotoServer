// eslint-disable-next-line import/no-extraneous-dependencies, global-require
const faker = require('../../node_modules/faker')
const Team = require('../../models').Team

class TeamFactory {
  static params () {
    return {
      name: faker.name.firstName()
    }
  }

  static async create () {
    const user = await Team.create(TeamFactory.params())
    return user
  }
}

module.exports = TeamFactory
