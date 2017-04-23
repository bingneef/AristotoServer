/* eslint-env node, jest */
const sequelize     = require('../../databaseConnection')
const Round         = require('../../models').Round
const RoundFactory  = require('../factory/RoundFactory')

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
    expect(Object.keys(Round.associations)).toEqual(['matches'])
  })

  test('attributes', () => {
    expect(Object.keys(Round.attributes)).toEqual(
      [
        'id',
        'visible',
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

  beforeEach(async (done) => {
    a = await RoundFactory.create()
    b = await RoundFactory.create()
    c = await RoundFactory.create({ visible: false })
    done()
  })

  test('visible: true', async () => {
    const rounds = await Round.findAll({ attributes: ['id'] })
    expect(rounds.length).toEqual(2)
    expect(rounds.map(round => round.id)).toEqual([a.id, b.id])
  })

  test('unscoped', async () => {
    const rounds = await Round.unscoped().findAll({ attributes: ['id'] })
    expect(rounds.length).toEqual(3)
    expect(rounds.map(round => round.id)).toEqual([a.id, b.id, c.id])
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

