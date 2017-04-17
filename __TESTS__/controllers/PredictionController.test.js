/* eslint-env node, jest */
const PredictionController  = require('../../controllers/PredictionController')
const PredictionFactory     = require('../factory/PredictionFactory')
const sequelize       = require('../../databaseConnection')
const PredictionSerializer  = require('../../serializers/PredictionSerializer')
const Prediction            = require('../../models').Prediction

beforeEach(async (done) => {
  await sequelize.sync(
    {
      force: true
    }
  )
  done()
})

describe('#update', () => {
  it('update an prediction', async () => {
    let a = await PredictionFactory.create({ value: 'home' })
    const ctx = {
      state: {
        currentPrediction: a
      },
      request: {
        body: {
          value: 'away'
        }
      }
    }

    a = await a.reload()

    await PredictionController.update(ctx)

    expect(ctx.body.value).toEqual('away')
    expect(ctx.body).toEqual(a.serialize(PredictionSerializer))
  })

  it('trims value of value if not in enum', async () => {
    let a = await PredictionFactory.create({ value: 'home' })
    const ctx = {
      state: {
        currentPrediction: a
      },
      request: {
        body: {
          value: 'bogus'
        }
      }
    }

    a = await a.reload()
    await PredictionController.update(ctx)

    expect(ctx.body.value).toEqual('home')
    expect(ctx.body).toEqual(a.serialize(PredictionSerializer))
  })
})

describe('#destroy', () => {
  it('destroys the prediction and return 204', async () => {
    const a = await PredictionFactory.create()
    const ctx = {
      state: {
        currentPrediction: a
      }
    }

    await PredictionController.destroy(ctx)
    const predictions = await Prediction.findAll()
    expect(predictions.length).toEqual(0)

    expect(ctx.status).toEqual(204)
  });
})
