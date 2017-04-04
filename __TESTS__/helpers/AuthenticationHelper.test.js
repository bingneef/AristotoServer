/* eslint-env node, jest */
let ctx;
const AuthenticationHelper = require('../../helpers/AuthenticationHelper')
const UserFactory          = require('../factory/UserFactory')
const sequelize            = require('../../databaseConnection')

beforeEach(async (done) => {
  await sequelize.sync(
    {
      force: true
    }
  )

  ctx = {
    throw: (status) => {
      throw new Error(status)
    },
    state: {}
  }

  done()
})

describe('#authenticate', () => {
  test('AuthenticationHelper throws 401 if errornous token', async () => {
    try {
      await AuthenticationHelper.authenticate(ctx, null)
    } catch (e) {
      expect(e.message).toEqual('401')
    }
  })

  test('AuthenticationHelper throws 401 if no token', async () => {
    ctx.request = {
      header: {
        authorization: 'bogus'
      }
    }

    try {
      await AuthenticationHelper.authenticate(ctx, null)
    } catch (e) {
      expect(e.message).toEqual('401')
    }
  })

  test('AuthenticationHelper sets user to ctx.state.currentUser', async () => {
    const user = await UserFactory.create()
    ctx.request = {
      header: {
        authorization: `Authentication Token token=${user.apiToken}`
      }
    }

    const myMockFn = jest.fn()
    await AuthenticationHelper.authenticate(ctx, myMockFn)
    expect(ctx.state.currentUser.id).toBe(user.id)
    expect(myMockFn).toBeCalled()
  })

  test('AuthenticationHelper throws 401 if no active user found', async () => {
    const user = await UserFactory.create()
    await user.update({
      active: false
    })

    ctx.request = {
      header: {
        authorization: `Authentication Token token=${user.apiToken}`
      }
    }

    const myMockFn = jest.fn()
    try {
      await AuthenticationHelper.authenticate(ctx, myMockFn)
    } catch (e) {
      expect(e.message).toEqual('401')
    }

    expect(myMockFn).not.toBeCalled()
  })
})

