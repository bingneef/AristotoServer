const Match            = require('../models').Match
const MatchSerializer  = require('../serializers/MatchSerializer')
const Prediction       = require('../models').Prediction
const Round            = require('../models').Round
const RoundSerializer  = require('../serializers/RoundSerializer')
const Team             = require('../models').Team

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
