/* eslint-env node, jest */
const MatchSerializer = require('./../../serializers/MatchSerializer')
const MatchFactory    = require('../factory/MatchFactory')
const Match           = require('./../../models').Match
const sequelize       = require('../../databaseConnection')

beforeEach(async (done) => {
  await sequelize.sync(
    {
      force: true
    }
  )
  done()
})

test('Scheme', async () => {
  expect(Object.keys(MatchSerializer)).toEqual(
    [
      'include',
      'exclude',
      'as',
      'assoc'
    ]
  )

  expect(MatchSerializer.include).toEqual(
    [
      '@all',
      'team'
    ]
  )

  expect(MatchSerializer.exclude).toEqual(
    [
      'active',
      '@fk',
      '@auto'
    ]
  )

  expect(MatchSerializer.as).toEqual(
    {
      team: 'clubTeam'
    }
  )

  expect(MatchSerializer.assoc).toEqual(
    {
      team: {
        exclude: [
          '@fk',
          '@auto'
        ]
      }
    }
  )
})

test('Match json', async () => {
  let a = await MatchFactory.create()
  a = await Match.findOne({ roundId: a.id })
  const serializedMatch = a.serialize(MatchSerializer)
  expect(Object.keys(serializedMatch)).toEqual(
    ['id', 'opponentName', 'isHome', 'homeScore', 'awayScore', 'playedAt']
  )
})
