/* eslint-env node, jest */
const UserSerializer = require('./../../serializers/UserSerializer')
const UserFactory = require('../factory/UserFactory')
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
  expect(Object.keys(UserSerializer)).toEqual(
    [
      'exclude'
    ]
  )
  expect(UserSerializer.exclude).toEqual(
    [
      'active',
      '@pk',
      '@fk',
      '@auto'
    ]
  )
})

test('User json', async () => {
  const user = await UserFactory.create()
  const serializedUser = user.serialize(UserSerializer)
  expect(Object.keys(serializedUser)).toEqual(
    ['firstName', 'lastName', 'avatarUrl', 'email', 'apiToken']
  )
})
