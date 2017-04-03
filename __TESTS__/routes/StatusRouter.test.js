/* eslint-env node, jest */
const StatusRouter = require('../../routes/StatusRouter');

test('StatusRouter Is Exported', () => {
  expect(StatusRouter).toBeDefined();
  expect(Object.keys(StatusRouter).length > 0).toBeTruthy();
});

test('StatusRouter Is Exported', () => {
  expect(StatusRouter.stack[0].path).toBe('/status')
});
