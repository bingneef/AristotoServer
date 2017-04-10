/* eslint-env node, jest */
const RoundSerializer = require('./../../serializers/RoundSerializer')
const RoundFactory = require('../factory/RoundFactory')
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
  expect(Object.keys(RoundSerializer)).toEqual(
    [
      'exclude'
    ]
  )
  expect(RoundSerializer.exclude).toEqual(
    [
      'visible',
      '@fk',
      '@auto'
    ]
  )
})

test('Round json', async () => {
  const team = await RoundFactory.create()
  const serializedRound = team.serialize(RoundSerializer)
  expect(Object.keys(serializedRound)).toEqual(
    ['id', 'value']
  )
})
