// eslint-disable-next-line import/no-extraneous-dependencies, global-require
const faker = require('../../node_modules/faker')
const Round = require('../../models').Round

class RoundFactory {
  static params (override) {
    let visible = override.visible
    if (visible === undefined) {
      visible = true
    }

    return {
      value: override.value || faker.random.number(),
      visible
    }
  }

  static async create (params) {
    const round = await Round.create(RoundFactory.params(params || {}))
    return round
  }
}

module.exports = RoundFactory
