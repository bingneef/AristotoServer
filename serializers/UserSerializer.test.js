/* eslint-env node, jest */

const UserSerializer = require('./UserSerializer');
const UserFactory = require('../spec/factory/UserFactory')
const sequelize = require('../databaseConnection')

beforeAll(async (done) => {
  await sequelize.sync({force: true})
  done()
})

test('Scheme', async () => {
  expect(Object.keys(UserSerializer)).toEqual(['exclude'])
  expect(UserSerializer.exclude).toEqual([ 'active', '@pk', '@fk', '@auto' ])
})

test('User json', async () => {
  var user = await UserFactory.create()
  var serializedUser = user.serialize(UserSerializer)
  expect(Object.keys(serializedUser)).toEqual(
    ['firstName', 'lastName', 'avatarUrl', 'email', 'apiToken']
  )
})
