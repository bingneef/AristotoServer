/* eslint-env node, jest */
const Team = require('../../models').Team

describe('Database properties', () => {
  test('associations', () => {
    expect(Object.keys(Team.associations)).toEqual(['matches'])
  })

  test('attributes', () => {
    expect(Object.keys(Team.attributes)).toEqual(
      [
        'id',
        'name',
        'createdAt',
        'updatedAt'
      ]
    )
  })
})
