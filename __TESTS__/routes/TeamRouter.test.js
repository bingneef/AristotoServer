/* eslint-env node, jest */
const TeamRouter = require('../../routes/TeamRouter');

test('TeamRouter Is Exported', () => {
  expect(TeamRouter).toBeDefined();
  expect(Object.keys(TeamRouter).length > 0).toBeTruthy();
});

test('TeamRouter has base_href', () => {
  expect(TeamRouter.opts.prefix).toBe('/api/v1/teams')
});

test('TeamRouter has the routes', () => {
  expect(TeamRouter.stack[0].path).toBe('/api/v1/teams/')
  expect(TeamRouter.stack[1].path).toBe('/api/v1/teams/')
});
