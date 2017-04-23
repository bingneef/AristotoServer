/* eslint-env node, jest */
const sequelize     = require('../../databaseConnection')
const OauthFactory  = require('../factory/OauthFactory')
const Oauth         = require('../../models').Oauth
const UserFactory   = require('../factory/UserFactory')

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
    expect(Object.keys(Oauth.associations)).toEqual(['user'])
    expect(Oauth.attributes.userId.references.model).toEqual('users')
  })

  test('attributes', () => {
    expect(Object.keys(Oauth.attributes)).toEqual(
      [
        'id',
        'type',
        'identifier',
        'userId',
        'createdAt',
        'updatedAt'
      ]
    )
  })
})

describe('#getUserOfToken', () => {
  let type
  let identifier
  let firstName
  let lastName
  let email
  let avatarUrl
  let doneMock

  beforeEach(async (done) => {
    type = 'google'
    identifier = '1234'
    firstName = 'Chuck'
    lastName = 'Norris'
    email = 'chuck@norris.now'
    avatarUrl = '{url}'
    doneMock = jest.fn()

    done()
  })

  it('returns the user if email found', async () => {
    const user = await UserFactory.create({ email: 'chuck@norris.now' })
    await Oauth.getUserOfToken(type, identifier, firstName, lastName, email, avatarUrl, doneMock)

    expect(doneMock).toBeCalled()
    expect(doneMock.mock.calls[0][1].id).toEqual(user.id)
  })

  it('creates a new user if email not found', async () => {
    const user = await UserFactory.create({ email: 'bogus@bogus.now' })
    await Oauth.getUserOfToken(type, identifier, firstName, lastName, email, avatarUrl, doneMock)

    expect(doneMock).toBeCalled()
    expect(doneMock.mock.calls[0][1].id).not.toEqual(user.id)
  })

  it('finds the user by the token and identifier', async () => {
    const user = await UserFactory.create()
    await OauthFactory.create({ identifier: '1234', type: 'google', userId: user.id })
    await Oauth.getUserOfToken(type, identifier, firstName, lastName, email, avatarUrl, doneMock)

    expect(doneMock).toBeCalled()
    expect(doneMock.mock.calls[0][1].id).toEqual(user.id)
  })

  it('finds the user by the token and identifier', async () => {
    const user = await UserFactory.create()
    await OauthFactory.create({ identifier: '1234', type: 'facebook', userId: user.id })
    await Oauth.getUserOfToken(type, identifier, firstName, lastName, email, avatarUrl, doneMock)

    expect(doneMock).toBeCalled()
    expect(doneMock.mock.calls[0][1].id).not.toEqual(user.id)
  })
})
