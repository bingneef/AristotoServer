// eslint-disable-next-line import/no-extraneous-dependencies, global-require
const Oauth = require('../../models').Oauth
const UserFactory  = require('./RoundFactory')

class OauthFactory {
  static async params (override) {
    let userId = override.userId
    if (userId === undefined) {
      const user = await UserFactory.create()
      userId = user.id
    }

    return {
      type: override.type || 'google',
      identifier: override.identifier || '1234',
      userId
    }
  }

  static async create (params) {
    const oauth = await Oauth.create(await OauthFactory.params(params || {}))
    return oauth
  }
}

module.exports = OauthFactory
