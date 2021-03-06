/* eslint-env node, jest */
const RoundController   = require('../../controllers/RoundController')
const RoundFactory      = require('../factory/RoundFactory')
const UserFactory       = require('../factory/UserFactory')
const MatchFactory      = require('../factory/MatchFactory')
const sequelize         = require('../../databaseConnection')
const RoundSerializer   = require('../../serializers/RoundSerializer')
const MatchSerializer   = require('../../serializers/MatchSerializer')
const Round             = require('../../models').Round
const Match             = require('../../models').Match
const Team              = require('../../models').Team
const Prediction        = require('../../models').Prediction

beforeEach(async (done) => {
  await sequelize.sync(
    {
      force: true
    }
  )
  done()
})

describe('#getRounds', () => {
  it('returns an serialized array of rounds', async () => {
    const a = await RoundFactory.create()
    const b = await RoundFactory.create()
    const ctx = {}

    await RoundController.getRounds(ctx)

    expect(ctx.body.length).toEqual(2)
    expect(ctx.body).toEqual(Round.serialize([a, b], RoundSerializer))
  })
})

describe('#getMatches', () => {
  it('returns an serialized array of matches for the round', async () => {
    const a = await RoundFactory.create()
    const b = await RoundFactory.create()

    let matchA = await MatchFactory.create({ roundId: a.id })
    let matchB = await MatchFactory.create({ roundId: a.id })
    await MatchFactory.create({ roundId: b.id })

    const ctx = {
      state: {
        currentUser: {},
        currentRound: a
      }
    }

    matchA = await Match.findOne(
      {
        where: matchA.id,
        include: [
          {
            model: Team
          },
          {
            model: Prediction,
            where: {
              userId: 1
            },
            required: false
          }
        ]
      }
    )

    matchB = await Match.findOne(
      {
        where: matchB.id,
        include: [
          {
            model: Team
          },
          {
            model: Prediction,
            where: {
              userId: 1
            },
            required: false
          }
        ]
      }
    )

    await RoundController.getMatches(ctx)

    expect(ctx.body.length).toEqual(2)
    expect(ctx.body).toEqual([matchA.serialize(MatchSerializer), matchB.serialize(MatchSerializer)])
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

  it('sets the prediction for the match', async () => {
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

    await RoundController.setPredictions(ctx)

    expect(ctx.body.length).toEqual(2)
    expect(ctx.body[0].myPrediction[0].value).toEqual('home')
    expect(ctx.body[1].myPrediction[0].value).toEqual('draw')
  })
})
