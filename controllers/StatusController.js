var StatusController = function () {};

StatusController.prototype.getStatus = async (ctx) => {
  ctx.body = {
    alive: true
  }
  ctx.status = 200
}

module.exports = new StatusController();
