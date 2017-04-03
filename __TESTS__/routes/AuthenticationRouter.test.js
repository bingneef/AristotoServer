/* eslint-env node, jest */
const AuthenticationRouter = require('../../routes/AuthenticationRouter');

test('AuthenticationRouter Is Exported', () => {
  expect(AuthenticationRouter).toBeDefined();
  expect(Object.keys(AuthenticationRouter).length > 0).toBeTruthy();
});

test('AuthenticationRouter has base_href', () => {
  expect(AuthenticationRouter.opts.prefix).toBe('/api/v1')
});

test('AuthenticationRouter has the routes', () => {
  expect(AuthenticationRouter.stack[0].path).toBe('/api/v1/')
  expect(AuthenticationRouter.stack[1].path).toBe('/api/v1/current_user')
  expect(AuthenticationRouter.stack[2].path).toBe('/api/v1/logout')
});
