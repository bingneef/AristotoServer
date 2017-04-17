const Round            = require('../models').Round
const Match            = require('../models').Match
const Team             = require('../models').Team
const Prediction       = require('../models').Prediction
const RoundSerializer  = require('../serializers/RoundSerializer')
const MatchSerializer  = require('../serializers/MatchSerializer')

const generatePredictionParams = (ctx, params, validMatchIds) => {
  if (validMatchIds.indexOf(params.matchId) === -1) {
    ctx.throw(422)
  }

  if (Prediction.rawAttributes.value.values.indexOf(params.value) === -1) {
    ctx.throw(422)
  }

  const payload = {
    userId: ctx.state.currentUser.id,
    matchId: params.matchId,
    value: params.value
  }

  return payload
}

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
    const validMatchIds = await ctx.state.currentRound.getMatches(
      {
        where: {
          active: true
        },
        attributes: ['id']
      }
    ).map(match => match.id)

    const paramsMatchIds = ctx.request.body.map(
      data => data.matchId
    )

    const updateableMatchIds = await ctx.state.currentUser.getPredictions(
      {
        where: {
          matchId: {
            $in: validMatchIds
          },
        },
        attributes: ['matchId']
      }
    ).map(match => match.matchId)

    const createableMatchIds = validMatchIds.filter(
      data => updateableMatchIds.indexOf(data) === -1
    )

    const deleteableMatchIds = validMatchIds.filter(
      data => paramsMatchIds.indexOf(data) === -1
    )

    // Destroyable
    Prediction.destroy({
      where: {
        matchId: {
          $in: deleteableMatchIds
        },
        userId: ctx.state.currentUser.id
      }
    })

    // Mapped prediction params
    const predictionParams = ctx.request.body.map(
      data => generatePredictionParams(ctx, data, validMatchIds)
    )

    // Createable
    const createParams = predictionParams.filter(
      data => createableMatchIds.indexOf(data.matchId) > -1
    )
    await Prediction.bulkCreate(createParams)

    // Updateable
    const updateParams = predictionParams.filter(
      data => updateableMatchIds.indexOf(data.matchId) > -1
    )
    for (const data of updateParams) {
      // eslint-disable-next-line no-await-in-loop
      await Prediction.update(
        {
          value: data.value
        }, {
          where: {
            userId: data.userId,
            matchId: data.matchId
          }
        }
      )
    }

    await RoundController.getMatches(ctx)
  }
}

module.exports = RoundController
