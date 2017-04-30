// eslint-disable-next-line import/no-extraneous-dependencies, global-require
const faker = require('../../node_modules/faker')
const Round = require('../../models').Round

class RoundFactory {
  static params (override) {
    return {
      value: override.value || faker.random.number(),
      state: override.state || 'preparing'
    }
  }

  static async create (params) {
    const round = await Round.create(RoundFactory.params(params || {}))
    return round
  }
}

module.exports = RoundFactory
