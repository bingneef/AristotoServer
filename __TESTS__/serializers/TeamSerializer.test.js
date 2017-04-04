/* eslint-env node, jest */
const TeamSerializer = require('./../../serializers/TeamSerializer')
const TeamFactory = require('../factory/TeamFactory')
const sequelize = require('../../databaseConnection')

beforeEach(async (done) => {
  await sequelize.sync(
    {
      force: true
    }
  )
  done()
})

test('Scheme', async () => {
  expect(Object.keys(TeamSerializer)).toEqual(
    [
      'exclude'
    ]
  )
  expect(TeamSerializer.exclude).toEqual(
    [
      '@fk',
      '@auto'
    ]
  )
})

test('Team json', async () => {
  const team = await TeamFactory.create()
  const serializedTeam = team.serialize(TeamSerializer)
  expect(Object.keys(serializedTeam)).toEqual(
    ['id', 'name']
  )
})
