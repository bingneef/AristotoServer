/* eslint-env node, jest */
const routes = require('../../routes')

describe('Exports the routers', () => {
  test('AuthenticationRouter Is Exported', () => {
    expect(routes.AuthenticationRouter).not.toBe(null)
  });

  test('StatusRouter Is Exported', () => {
    expect(routes.StatusRouter).not.toBe(null)
  });

  test('OauthRouter Is Exported', () => {
    expect(routes.OauthRouter).not.toBe(null)
  });

  test('PredictionRouter Is Exported', () => {
    expect(routes.PredictionRouter).not.toBe(null)
  });

  test('RoundRouter Is Exported', () => {
    expect(routes.RoundRouter).not.toBe(null)
  });

  test('TeamRouter Is Exported', () => {
    expect(routes.TeamRouter).not.toBe(null)
  });
})
