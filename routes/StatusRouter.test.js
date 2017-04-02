const statusRouter = require('./StatusRouter');

test('StatusRouter Is Exported', () => {
  expect(statusRouter).toBeDefined();
  expect(Object.keys(statusRouter).length > 0).toBeTruthy();
});

test('StatusRouter Is Exported', () => {
  expect(statusRouter.stack[0].path).toBe('/status')
});
