const constants = require('../config/constants')

class StatusController {
  static async getStatus (ctx) {
    ctx.body = {
      alive: true,
      version: constants.version
    }
    ctx.status = 200
  }
}

module.exports = StatusController
