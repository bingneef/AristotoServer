/* eslint-env node, jest */
const PredictionRouter = require('../../routes/PredictionRouter');

test('PredictionRouter Is Exported', () => {
  expect(PredictionRouter).toBeDefined();
  expect(Object.keys(PredictionRouter).length > 0).toBeTruthy();
});

test('PredictionRouter has base_href', () => {
  expect(PredictionRouter.opts.prefix).toEqual('/api/v1/predictions')
});

test('PredictionRouter has the routes', () => {
  expect(PredictionRouter.stack[0].path).toEqual('/api/v1/predictions/')
  expect(PredictionRouter.stack[0].methods).toEqual([])

  expect(PredictionRouter.stack[1].path).toEqual('/api/v1/predictions/:id')
  expect(PredictionRouter.stack[1].methods).toEqual([])

  expect(PredictionRouter.stack[2].path).toEqual('/api/v1/predictions/:id')
  expect(PredictionRouter.stack[2].methods).toEqual(['HEAD', 'GET'])

  expect(PredictionRouter.stack[3].path).toEqual('/api/v1/predictions/:id')
  expect(PredictionRouter.stack[3].methods).toEqual(['PUT'])

  expect(PredictionRouter.stack[4].path).toEqual('/api/v1/predictions/:id')
  expect(PredictionRouter.stack[4].methods).toEqual(['DELETE'])

  expect(PredictionRouter.stack[5]).not.toBeTruthy()
});
