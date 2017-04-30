// eslint-disable-next-line import/no-extraneous-dependencies, global-require
const RoundScore = require('../../models').RoundScore
const RoundFactory  = require('./RoundFactory')
const UserFactory   = require('./UserFactory')

class RoundScoreFactory {
  static async params (override) {
    let userId = override.userId
    if (userId === undefined) {
      const user = await UserFactory.create()
      userId = user.id
    }

    let roundId = override.roundId
    if (roundId === undefined) {
      const user = await RoundFactory.create()
      roundId = user.id
    }

    return {
      value: override.value || 0,
      userId,
      roundId
    }
  }

  static async create (params) {
    const oauth = await RoundScore.create(await RoundScoreFactory.params(params || {}))
    return oauth
  }
}

module.exports = RoundScoreFactory
