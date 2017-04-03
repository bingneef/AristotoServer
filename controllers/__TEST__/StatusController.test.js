/* eslint-env node, jest */
const statusController = require('./../StatusController');

it('Get status return {alive: true}', async () => {
  const ctx = {}
  await statusController.getStatus(ctx)
  expect(ctx.status).toBe(200)
  expect(ctx.body.alive).toEqual(true)
});
