/* eslint-env node, jest */
const TeamController  = require('../../controllers/TeamController')
const TeamFactory     = require('../factory/TeamFactory')
const sequelize       = require('../../databaseConnection')
const TeamSerializer  = require('../../serializers/TeamSerializer')
const Team            = require('../../models').Team

beforeEach(async (done) => {
  await sequelize.sync(
    {
      force: true
    }
  )
  done()
})

describe('#getTeams', () => {
  it('returns an serialized array of teams', async () => {
    const a = await TeamFactory.create()
    const b = await TeamFactory.create()
    const ctx = {}

    await TeamController.getTeams(ctx)

    expect(ctx.body.length).toEqual(2)
    expect(ctx.body).toEqual(Team.serialize([a, b], TeamSerializer))
  });
})
