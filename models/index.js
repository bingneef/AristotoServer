const User = require('./User.js')
const Oauth = require('./Oauth.js')

Oauth.belongsTo(User)
User.hasMany(Oauth, {
  onDelete: 'cascade',
})

module.exports = {
  Oauth,
  User,
}
