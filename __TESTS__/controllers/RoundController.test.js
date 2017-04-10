/* eslint-env node, jest */
const RoundController  = require('../../controllers/RoundController')
const RoundFactory     = require('../factory/RoundFactory')
const MatchFactory     = require('../factory/MatchFactory')
const sequelize        = require('../../databaseConnection')
const RoundSerializer  = require('../../serializers/RoundSerializer')
const MatchSerializer  = require('../../serializers/MatchSerializer')
const Round            = require('../../models').Round
const Match            = require('../../models').Match
const Team             = require('../../models').Team

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
  });
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
        currentRound: a
      }
    }

    matchA = await Match.findOne({ where: matchA.id, include: Team })
    matchB = await Match.findOne({ where: matchB.id, include: Team })

    await RoundController.getMatches(ctx)

    expect(ctx.body.length).toEqual(2)
    expect(ctx.body).toEqual([matchA.serialize(MatchSerializer), matchB.serialize(MatchSerializer)])
  });
})
