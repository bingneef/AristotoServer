/* eslint-env node, jest */
let ctx;
const sequelize     = require('../../databaseConnection')
const RoundHelper   = require('../../helpers/RoundHelper')
const RoundFactory  = require('../factory/RoundFactory')

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

describe('#getRound', () => {
  test('RoundHelper throws 404 if not found', async () => {
    ctx.params = {
      id: 'bogus'
    }

    try {
      await RoundHelper.getRound(ctx, null)
    } catch (e) {
      expect(e.message).toEqual('404')
    }
  })

  test('RoundHelper sets round to ctx.state.currentRound', async () => {
    const a = await RoundFactory.create()
    ctx.params = {
      id: a.id
    }

    const myMockFn = jest.fn()
    await RoundHelper.getRound(ctx, myMockFn)
    expect(ctx.state.currentRound.id).toBe(a.id)
    expect(myMockFn).toBeCalled()
  })

  test('RoundHelper throws 404 if no active visible found', async () => {
    const a = await RoundFactory.create({ visible: false })
    await RoundFactory.create()
    ctx.params = {
      id: a.id
    }

    const myMockFn = jest.fn()
    try {
      await RoundHelper.getRound(ctx, myMockFn)
    } catch (e) {
      expect(e.message).toEqual('404')
    }

    expect(myMockFn).not.toBeCalled()
  })
})

