/* eslint-env node, jest */
const routes = require('../../routes')

describe('Exports the routers', () => {
  test('AuthenticationRouter Is Exported', () => {
    expect(routes.AuthenticationRouter).not.toBe(null)
  });

  test('StatusRouter Is Exported', () => {
    expect(routes.StatusRouter).not.toBe(null)
  });
})
