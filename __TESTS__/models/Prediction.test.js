/* eslint-env node, jest */
const Prediction = require('../../models').Prediction

describe('Database properties', () => {
  test('associations', () => {
    expect(Object.keys(Prediction.associations)).toEqual(['match', 'user'])
  })

  test('attributes', () => {
    expect(Object.keys(Prediction.attributes)).toEqual(
      [
        'id',
        'userId',
        'matchId',
        'value',
        'createdAt',
        'updatedAt'
      ]
    )
  })
})
