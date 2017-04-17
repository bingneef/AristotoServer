/* eslint-env node, jest */
const RoundRouter = require('../../routes/RoundRouter');

test('RoundRouter Is Exported', () => {
  expect(RoundRouter).toBeDefined();
  expect(Object.keys(RoundRouter).length > 0).toBeTruthy();
});

test('RoundRouter has base_href', () => {
  expect(RoundRouter.opts.prefix).toEqual('/api/v1/rounds')
});

test('RoundRouter has the routes', () => {
  expect(RoundRouter.stack[0].path).toEqual('/api/v1/rounds/')
  expect(RoundRouter.stack[0].methods).toEqual([])

  expect(RoundRouter.stack[1].path).toEqual('/api/v1/rounds/')
  expect(RoundRouter.stack[1].methods).toEqual(['HEAD', 'GET'])

  expect(RoundRouter.stack[2].path).toEqual('/api/v1/rounds/:id')
  expect(RoundRouter.stack[2].methods).toEqual([])

  expect(RoundRouter.stack[3].path).toEqual('/api/v1/rounds/:id/matches')
  expect(RoundRouter.stack[3].methods).toEqual(['HEAD', 'GET'])

  expect(RoundRouter.stack[4].path).toEqual('/api/v1/rounds/:id/predictions')
  expect(RoundRouter.stack[4].methods).toEqual(['POST'])

  expect(RoundRouter.stack[5]).not.toBeTruthy()
});
