const constants = require('../config/constants')

const StatusController = () => { }

StatusController.prototype.getStatus = async (ctx) => {
  ctx.body = {
    alive: true,
    version: constants.version
  }
  ctx.status = 200
}

module.exports = new StatusController()
