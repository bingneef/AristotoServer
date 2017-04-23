/* eslint-env node, jest */
jest.mock('../../oauth');
const OauthController = require('../../controllers/OauthController');
const passport = require('../../oauth')

let ctx
let mockNext
let mockRender

beforeEach(async (done) => {
  mockNext = jest.fn()
  mockRender = jest.fn()
  ctx = {
    throw: (status) => {
      throw new Error(status)
    },
    state: {
      currentUser: {
        id: 1
      }
    },
    render (content) {
      return mockRender(content)
    }
  }
  done()
})

describe('#facebookCallback', () => {
  it('renders oauth_callback if no error', async () => {
    const mockCallback = jest.fn()

    passport.authenticate = (data, cb) => {
      cb(null, {})
      return mockCallback
    }

    await OauthController.facebookCallback(ctx, mockNext)
    expect(mockRender.mock.calls[0][0]).toEqual('oauth_callback')
    expect(mockCallback).toBeCalled()
  })

  it('renders 422 if error', async () => {
    const mockCallback = jest.fn()

    passport.authenticate = (data, cb) => {
      cb('error')
        .then(() => {})
        .catch(() => {})
      return mockCallback
    }

    await OauthController.facebookCallback(ctx, mockNext)
    expect(mockRender).not.toBeCalled()
    expect(mockCallback).toBeCalled()
  })
})

describe('#googleCallback', () => {
  it('renders oauth_callback if no error', async () => {
    const mockCallback = jest.fn()

    passport.authenticate = (data, cb) => {
      cb(null, {})
      return mockCallback
    }

    await OauthController.googleCallback(ctx, mockNext)
    expect(mockRender.mock.calls[0][0]).toEqual('oauth_callback')
    expect(mockCallback).toBeCalled()
  })

  it('renders 422 if error', async () => {
    const mockCallback = jest.fn()

    passport.authenticate = (data, cb) => {
      cb('error')
        .then(() => {})
        .catch(() => {})
      return mockCallback
    }

    await OauthController.googleCallback(ctx, mockNext)
    expect(mockRender).not.toBeCalled()
    expect(mockCallback).toBeCalled()
  })
})
