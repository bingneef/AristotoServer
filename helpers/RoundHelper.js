const Round = require('../models').Round

class RoundHelper {
  static async getRound (ctx, next) {
    const round = await Round.findOne({
      where: {
        id: ctx.params.id
      }
    })

    if (!round) ctx.throw(404)

    ctx.state.currentRound = round
    await next()
  }
}

module.exports = RoundHelper
