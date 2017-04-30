const Prediction  = require('./Prediction')
const User        = require('./User')
const RoundScore  = require('./RoundScore')
const Match       = require('./Match')
const Sequelize   = require('sequelize')
const groupArray = require('group-array')
const database    = require('../databaseConnection')

const Round = database.define('rounds',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    visible: {
      type: Sequelize.BOOLEAN
    },
    value: {
      type: Sequelize.INTEGER
    }
  },
  {
    defaultScope: {
      where: {
        visible: true
      }
    },
    classMethods: {
      generatePredictionParams (ctx, params, validMatchIds) {
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
    },
    instanceMethods: {
      async getPredictions () {
        const matchIds = await this.getMatches({
          attributes: ['id']
        }).map(match => match.id)

        const predictions = await Prediction.findAll({
          where: {
            matchId: {
              $in: matchIds
            }
          },
          include: [
            {
              model: User,
              attributes: ['id']
            },
            {
              model: Match
            }
          ]
        })

        return predictions
      },
      async calculateScores () {
        const predictions = await this.getPredictions()
        const groupedPredictions = groupArray(predictions, 'userId')

        // eslint-disable-next-line guard-for-in
        for (const key in groupedPredictions) {
          let correctPredictions = 0
          let wrongPredictions = 0

          const userPredictions = groupedPredictions[key]
          const user = userPredictions[0].user

          for (const prediction of userPredictions) {
            let correct = false
            let invalidValue = false

            switch (prediction.value) {
              case 'home':
                if (prediction.match.homeScore > prediction.match.awayScore) {
                  correct = true
                }
                break;
              case 'draw':
                if (prediction.match.homeScore === prediction.match.awayScore) {
                  correct = true
                }
                break;
              case 'away':
                if (prediction.match.homeScore < prediction.match.awayScore) {
                  correct = true
                }
                break;
              default:
                invalidValue = true
            }

            if (!invalidValue) {
              if (correct) {
                correctPredictions += 1
              } else {
                wrongPredictions += 1
              }
            }
          }

          const value = RoundScore.calculateScore(correctPredictions, wrongPredictions)

          /* eslint-disable no-await-in-loop */
          const roundScore = await RoundScore.create({
            roundId: this.id,
            value
          })

          await user.setRoundScores([roundScore])
          /* eslint-enable no-await-in-loop */
        }

        await RoundScore.cleanUp()
      },
      async setPredictions (ctx) {
        const validMatchIds = await this.getMatches(
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
        await Prediction.destroy({
          where: {
            matchId: {
              $in: deleteableMatchIds
            },
            userId: ctx.state.currentUser.id
          }
        })

        // Mapped prediction params
        const predictionParams = ctx.request.body.map(
          data => Round.generatePredictionParams(ctx, data, validMatchIds)
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
      }
    }
  }
)

module.exports = Round
