const Router = require('koa-router');
const StatusController = require('../controllers/StatusController');
var StatusRouter = new Router();

StatusRouter.get('/status', StatusController.getStatus);

module.exports = StatusRouter
