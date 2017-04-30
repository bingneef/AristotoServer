/* eslint-env node, jest */
/* eslint-disable no-await-in-loop */

const sequelize     = require('../../databaseConnection')
const Round         = require('../../models').Round
const RoundFactory  = require('../factory/RoundFactory')
const RoundScore         = require('../../models').RoundScore
const UserFactory       = require('../factory/UserFactory')
const MatchFactory      = require('../factory/MatchFactory')
const PredictionFactory = require('../factory/PredictionFactory')
const Prediction        = require('../../models').Prediction

beforeEach(async (done) => {
  await sequelize.sync(
    {
      force: true
    }
  )
  done()
})

describe('Database properties', () => {
  test('associations', () => {
    expect(Object.keys(Round.associations)).toEqual(['matches', 'roundScores'])
  })

  test('attributes', () => {
    expect(Object.keys(Round.attributes)).toEqual(
      [
        'id',
        'state',
        'value',
        'createdAt',
        'updatedAt'
      ]
    )
  })
})

describe('#defaultScope', async () => {
  let a
  let b
  let c
  let d

  beforeEach(async (done) => {
    a = await RoundFactory.create({ state: 'preparing' })
    b = await RoundFactory.create({ state: 'published' })
    c = await RoundFactory.create({ state: 'finished' })
    d = await RoundFactory.create({ state: 'invalid' })
    done()
  })

  test('state', async () => {
    const rounds = await Round.findAll({ attributes: ['id'] })
    expect(rounds.length).toEqual(2)
    expect(rounds.map(round => round.id)).toEqual([b.id, c.id])
  })

  test('unscoped', async () => {
    const rounds = await Round.unscoped().findAll({ attributes: ['id'] })
    expect(rounds.length).toEqual(4)
    expect(rounds.map(round => round.id)).toEqual([a.id, b.id, c.id, d.id])
  })
})

describe('#generatePredictionParams', async () => {
  let ctx;
  let validMatchIds;

  beforeEach(async (done) => {
    ctx = {
      throw: (status) => {
        throw new Error(status)
      },
      state: {
        currentUser: {
          id: 1
        }
      }
    }

    validMatchIds = [1, 2]
    done()
  })

  test('throw 422 if invalid matchId', () => {
    const params = {
      matchId: 3
    }

    try {
      Round.generatePredictionParams(ctx, params, validMatchIds)
      expect(true).toEqual(false)
    } catch (e) {
      expect(e.message).toEqual('422')
    }
  })

  test('throw 422 if invalid value', () => {
    const params = {
      matchId: validMatchIds[0],
      value: 'bogus'
    }

    try {
      Round.generatePredictionParams(ctx, params, validMatchIds)
      expect(true).toEqual(false)
    } catch (e) {
      expect(e.message).toEqual('422')
    }
  })

  test('returns payload if valid params', () => {
    const params = {
      matchId: 2,
      value: 'home'
    }

    expect(Round.generatePredictionParams(ctx, params, validMatchIds)).toEqual(
      {
        userId: 1,
        matchId: 2,
        value: 'home'
      }
    )
  })
})

describe('#calculateScores', async () => {
  let currentRound
  let userA
  let matchA
  let matchB
  let matchC
  let matchD
  let matchE

  beforeEach(async (done) => {
    RoundScore.calculateScore = jest.fn();
    RoundScore.calculateScore.mockReturnValue(5)
    currentRound = await RoundFactory.create()
    userA = await UserFactory.create()
    matchA = await MatchFactory.create({ roundId: currentRound.id, homeScore: 2, awayScore: 1 })
    matchB = await MatchFactory.create({ roundId: currentRound.id, homeScore: 1, awayScore: 1 })
    matchC = await MatchFactory.create({ roundId: currentRound.id, homeScore: 0, awayScore: 1 })
    matchD = await MatchFactory.create({ roundId: currentRound.id, homeScore: 1, awayScore: 1 })
    matchE = await MatchFactory.create({ roundId: currentRound.id, homeScore: 2, awayScore: 2 })

    const userAPredictions = [
      {
        matchId: matchA.id,
        value: 'home'
      },
      {
        matchId: matchB.id,
        value: 'draw'
      },
      {
        matchId: matchC.id,
        value: 'away'
      },
      {
        matchId: matchD.id,
        value: 'home'
      },
      {
        matchId: matchE.id,
        value: 'home'
      }
    ]

    for (const prediction of userAPredictions) {
      await PredictionFactory.create(
        {
          userId: userA.id,
          matchId: prediction.matchId,
          value: prediction.value
        }
      )
    }

    done()
  })

  it('calculates the score for the current round', async () => {
    await currentRound.calculateScores()

    expect(RoundScore.calculateScore.mock.calls[0]).toEqual([3, 2])
    const roundScores = await RoundScore.findAll({
      where: {
        roundId: currentRound.id,
        userId: userA.id
      }
    })

    expect(roundScores.length).toEqual(1)
    expect(roundScores[0].value).toEqual(5)
  })

  it('ignore invalid values for value', async () => {
    const matchF = await MatchFactory.create(
      {
        roundId: currentRound.id,
        homeScore: 2,
        awayScore: 2
      }
    )
    await PredictionFactory.create(
      {
        userId: userA.id,
        matchId: matchF.id,
        value: 'bogus'
      }
    )

    await currentRound.calculateScores()

    expect(RoundScore.calculateScore.mock.calls[0]).toEqual([3, 2])
  })
})

describe('#getPredictions', async () => {
  let currentUser
  let currentRound
  let matchA
  let matchB
  let predictionA
  let predictionB

  beforeEach(async (done) => {
    currentUser = await UserFactory.create()
    currentRound = await RoundFactory.create()
    matchA = await MatchFactory.create({ roundId: currentRound.id, homeScore: 1, awayScore: 1 })
    matchB = await MatchFactory.create({ roundId: currentRound.id })
    predictionA = await PredictionFactory.create(
      {
        userId: currentUser.id,
        matchId: matchA.id,
        value: 'home'
      }
    )
    predictionB = await PredictionFactory.create(
      {
        userId: currentUser.id,
        matchId: matchB.id,
        value: 'away'
      }
    )
    done()
  })

  it('returns the predictions for the round', async () => {
    const otherRound = await RoundFactory.create()
    const otherMatch = await MatchFactory.create({ roundId: otherRound.id })
    await PredictionFactory.create(
      {
        userId: currentUser.id,
        matchId: otherMatch.id,
        value: 'home'
      }
    )

    const predictions = await currentRound.getPredictions()
    const predictionIds = predictions.map(prediction => prediction.id)
    expect(predictionIds).toEqual([predictionA.id, predictionB.id])
  })

  it('includes the match.home/awayScore and user.id in the returned value', async () => {
    const predictions = await currentRound.getPredictions()
    expect(predictions[0].match.homeScore).toBeTruthy()
    expect(predictions[0].match.awayScore).toBeTruthy()
    expect(predictions[0].user).toBeTruthy()
  })
})

describe('#setPredictions', () => {
  let ctx;
  let currentUser;
  let currentRound;
  let matchA;

  beforeEach(async (done) => {
    currentUser = await UserFactory.create()
    currentRound = await RoundFactory.create()

    matchA = await MatchFactory.create({ roundId: currentRound.id })
    ctx = {
      state: {
        currentUser,
        currentRound
      },
      request: {
        body: []
      },
      throw: (status) => {
        throw new Error(status)
      }
    }
    done()
  })

  it('sets returns no predictions if none provided', async () => {
    const matchIds = await currentRound.getMatches({
      attributes: ['id']
    }).map(match => match.id)

    await currentRound.setPredictions(ctx)

    const predictions = await Prediction.findAll({
      where: {
        userId: currentUser.id,
        matchId: {
          $in: matchIds
        }
      }
    })
    expect(predictions.length).toEqual(0)
  })

  it('sets the prediction if match for current round', async () => {
    const matchB = await MatchFactory.create({ roundId: currentRound.id })
    ctx.request = {
      body: [
        {
          matchId: matchA.id,
          value: 'home'
        },
        {
          matchId: matchB.id,
          value: 'draw'
        }
      ]
    }

    const matchIds = await currentRound.getMatches({
      attributes: ['id']
    }).map(match => match.id)

    await currentRound.setPredictions(ctx)

    const predictions = await Prediction.findAll({
      where: {
        userId: currentUser.id,
        matchId: {
          $in: matchIds
        }
      }
    })

    expect(predictions.length).toEqual(2)
    expect(predictions[0].value).toEqual('home')
    expect(predictions[1].value).toEqual('draw')
  })

  it('updates the prediction if already present for match and user', async () => {
    const prediction = await PredictionFactory.create(
      {
        userId: currentUser.id,
        matchId: matchA.id,
        value: 'away'
      }
    )

    ctx.request = {
      body: [
        {
          matchId: matchA.id,
          value: 'home'
        }
      ]
    }

    const matchIds = await currentRound.getMatches({
      attributes: ['id']
    }).map(match => match.id)

    await currentRound.setPredictions(ctx)

    const predictions = await Prediction.findAll({
      where: {
        userId: currentUser.id,
        matchId: {
          $in: matchIds
        }
      }
    })

    expect(predictions.length).toEqual(1)
    expect(predictions[0].id).toEqual(prediction.id)
    expect(predictions[0].value).toEqual('home')
  })

  it('delete the prediction if no longer in params', async () => {
    await PredictionFactory.create(
      {
        userId: currentUser.id,
        matchId: matchA.id,
        value: 'away'
      }
    )

    const matchIds = await currentRound.getMatches({
      attributes: ['id']
    }).map(match => match.id)

    await currentRound.setPredictions(ctx)

    const predictions = await Prediction.findAll({
      where: {
        userId: currentUser.id,
        matchId: {
          $in: matchIds
        }
      }
    })

    expect(predictions.length).toEqual(0)
  })
})
