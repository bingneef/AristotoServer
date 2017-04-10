/* eslint-env node, jest */
const sequelize     = require('../../databaseConnection')
const Match         = require('../../models').Match
const MatchFactory  = require('../factory/MatchFactory')

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
    expect(Object.keys(Match.associations)).toEqual(['round', 'team', 'predictions'])
  })

  test('attributes', () => {
    expect(Object.keys(Match.attributes)).toEqual(
      [
        'id',
        'active',
        'clubTeamId',
        'opponentName',
        'isHome',
        'homeScore',
        'awayScore',
        'roundId',
        'playedAt',
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
    a = await MatchFactory.create()
    b = await MatchFactory.create()
    c = await MatchFactory.create({ active: false })
    done()
  })

  test('active: true', async () => {
    const matches = await Match.findAll({ attributes: ['id'] })
    expect(matches.length).toEqual(2)
    expect(matches.map(match => match.id)).toEqual([a.id, b.id])
  })

  test('unscoped', async () => {
    const matches = await Match.unscoped().findAll({ attributes: ['id'] })
    expect(matches.length).toEqual(3)
    expect(matches.map(match => match.id)).toEqual([a.id, b.id, c.id])
  })
})
