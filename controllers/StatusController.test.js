const statusController = require('./StatusController');
it('Get status return {alive: true}', async () => {
  var ctx = {}
  await statusController.getStatus(ctx)
  expect(ctx.status).toBe(200)
  expect(ctx.body).toEqual({alive: true})
});
