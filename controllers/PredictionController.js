const Prediction  = require('../models').Prediction
const PredictionSerializer  = require('../serializers/PredictionSerializer')

const predictionParams = (body) => {
  let value = body.value
  if (Prediction.rawAttributes.value.values.indexOf(value) === -1) {
    value = null
  }

  const payload = {
    value
  }

  Object.keys(payload).forEach(key => (payload[key] == null) && delete payload[key]);
  return payload
}

class PredictionController {
  static async show (ctx) {
    ctx.body = ctx.state.currentPrediction.serialize(PredictionSerializer)
  }

  static async update (ctx) {
    const prediction = await ctx.state.currentPrediction.update(predictionParams(ctx.request.body))
    ctx.body = prediction.serialize(PredictionSerializer)
  }

  static async destroy (ctx) {
    await ctx.state.currentPrediction.destroy()
    ctx.status = 204
  }
}

module.exports = PredictionController
