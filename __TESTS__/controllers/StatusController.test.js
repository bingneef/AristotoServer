/* eslint-env node, jest */
const statusController = require('../../controllers/StatusController');

it('Get status return {alive: true}', async () => {
  var ctx = {}
  await statusController.getStatus(ctx)
  expect(ctx.status).toBe(200)
  expect(ctx.body.alive).toEqual(true)
});
