// eslint-disable-next-line import/no-extraneous-dependencies, global-require
const Prediction    = require('../../models').Prediction
const MatchFactory  = require('./MatchFactory')
const UserFactory   = require('./UserFactory')

class PredictionFactory {
  static async params (override) {
    let userId = override.userId
    if (userId === undefined) {
      const user = await UserFactory.create()
      userId = user.id
    }

    let matchId = override.matchId
    if (matchId === undefined) {
      const match = await MatchFactory.create()
      matchId = match.id
    }

    return {
      userId,
      matchId,
      value: override.value || 'home'
    }
  }

  static async create (params) {
    const prediction = await Prediction.create(await PredictionFactory.params(params || {}))
    return prediction
  }
}

module.exports = PredictionFactory
