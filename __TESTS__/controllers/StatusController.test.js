/* eslint-env node, jest */
const StatusController = require('../../controllers/StatusController');

it('Get status return {alive: true}', async () => {
  const ctx = {}
  await StatusController.getStatus(ctx)
  expect(ctx.status).toBe(200)
  expect(ctx.body.alive).toEqual(true)
});
