/* eslint-env node, jest */
const User = require('../../models').User

describe('Database properties', () => {
  test('Unique fields', () => {
    expect(User.options.uniqueKeys.users_email_unique.column).toEqual('email')
    expect(User.options.uniqueKeys.users_apiToken_unique.column).toEqual('apiToken')
  });

  test('associations', () => {
    expect(Object.keys(User.associations)).toEqual(['oauths', 'predictions'])
  })

  test('attributes', () => {
    expect(Object.keys(User.attributes)).toEqual(
      [
        'id',
        'firstName',
        'lastName',
        'avatarUrl',
        'email',
        'apiToken',
        'active',
        'createdAt',
        'updatedAt'
      ]
    )
    expect(User.attributes.email.unique).toBe(true)
    expect(User.attributes.apiToken.unique).toBe(true)
  })
})
