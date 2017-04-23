const Round            = require('../models').Round
const Match            = require('../models').Match
const Team             = require('../models').Team
const Prediction       = require('../models').Prediction
const RoundSerializer  = require('../serializers/RoundSerializer')
const MatchSerializer  = require('../serializers/MatchSerializer')

class RoundController {
  static async getRounds (ctx) {
    const teams = await Round.findAll()
    ctx.body = Round.serialize(teams, RoundSerializer)
  }

  static async getMatches (ctx) {
    const matches = await ctx.state.currentRound.getMatches({
      include: [
        {
          model: Team,
        },
        {
          model: Prediction,
          where: {
            userId: ctx.state.currentUser.id
          },
          required: false
        }
      ]
    })
    ctx.body = Match.serialize(matches, MatchSerializer)
  }

  static async setPredictions (ctx) {
    await ctx.state.currentRound.setPredictions(ctx)
    await RoundController.getMatches(ctx)
  }
}

module.exports = RoundController
