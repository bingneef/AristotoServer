// eslint-disable-next-line import/no-extraneous-dependencies, global-require
const faker = require('../../node_modules/faker')
const Team = require('../../models').Team

class TeamFactory {
  static params (override) {
    return {
      name: override.name || faker.name.firstName()
    }
  }

  static async create (params) {
    const user = await Team.create(TeamFactory.params(params || {}))
    return user
  }
}

module.exports = TeamFactory
