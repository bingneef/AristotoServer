const Router                = require('koa-router')
const PredictionController  = require('../controllers/PredictionController')
const AuthenticationHelper  = require('../helpers/AuthenticationHelper')
const PredictionHelper      = require('../helpers/PredictionHelper')

const PredictionRouter = new Router(
  {
    prefix: '/api/v1/predictions'
  }
)

PredictionRouter.use('/', AuthenticationHelper.authenticate)
PredictionRouter.use('/:id', PredictionHelper.getPrediction)
PredictionRouter.put('/:id', PredictionController.update)
PredictionRouter.delete('/:id', PredictionController.destroy)

module.exports = PredictionRouter
