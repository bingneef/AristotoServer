/* eslint-env node, jest */
let ctx;
const sequelize     = require('../../databaseConnection')
const PredictionHelper   = require('../../helpers/PredictionHelper')
const PredictionFactory  = require('../factory/PredictionFactory')

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

describe('#getPrediction', () => {
  test('PredictionHelper throws 401 if not found', async () => {
    ctx.params = {
      id: 'bogus'
    }

    try {
      await PredictionHelper.getPrediction(ctx, null)
    } catch (e) {
      expect(e.message).toEqual('401')
    }
  })

  test('PredictionHelper sets prediction to ctx.state.currentPrediction', async () => {
    const a = await PredictionFactory.create()
    ctx.params = {
      id: a.id
    }

    const myMockFn = jest.fn()
    await PredictionHelper.getPrediction(ctx, myMockFn)
    expect(ctx.state.currentPrediction.id).toBe(a.id)
    expect(myMockFn).toBeCalled()
  })
})

