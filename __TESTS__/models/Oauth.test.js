/* eslint-env node, jest */
const Oauth = require('../../models').Oauth

describe('Database properties', () => {
  test('associations', () => {
    expect(Object.keys(Oauth.associations)).toEqual(['user'])
    expect(Oauth.attributes.userId.references.model).toEqual('users')
  })

  test('attributes', () => {
    expect(Object.keys(Oauth.attributes)).toEqual(
      [
        'id',
        'type',
        'identifier',
        'userId',
        'createdAt',
        'updatedAt'
      ]
    )
  })
})
