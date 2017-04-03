/* eslint-env node, jest */
const AuthenticationController = require('../../controllers/AuthenticationController')
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

describe('#getCurrentUser', () => {
  it('returns an serialized user with apiToken', async () => {
    const user = await UserFactory.create()
    const ctx = {
      state: {
        currentUser: user
      }
    }
    await AuthenticationController.getCurrentUser(ctx)
    expect(!!ctx.body.apiToken).toEqual(true)
  });
})

describe('#logout', () => {
  it('', async () => {
    let user = await UserFactory.create()
    const userApiToken = user.apiToken
    const ctx = {
      state: {
        currentUser: user
      }
    }

    await AuthenticationController.logout(ctx)
    expect(ctx.status).toEqual(204)

    user = ctx.state.currentUser.get()
    expect(user.active).toEqual(false)
    expect(user.apiToken).not.toEqual(userApiToken)
  });
})
