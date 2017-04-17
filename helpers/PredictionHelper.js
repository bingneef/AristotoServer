const Prediction = require('../models').Prediction

class PredictionHelper {
  static async getPrediction (ctx, next) {
    const round = await Prediction.findOne({
      where: {
        id: ctx.params.id
      }
    })

    if (!round) ctx.throw(404)

    ctx.state.currentPrediction = round
    await next()
  }
}

module.exports = PredictionHelper
