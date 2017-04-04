/* eslint-env node, jest */
const Round = require('../../models').Round

describe('Database properties', () => {
  test('associations', () => {
    expect(Object.keys(Round.associations)).toEqual(['matches'])
  })

  test('attributes', () => {
    expect(Object.keys(Round.attributes)).toEqual(
      [
        'id',
        'visible',
        'value',
        'createdAt',
        'updatedAt'
      ]
    )
  })
})
