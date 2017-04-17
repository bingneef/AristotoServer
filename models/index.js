const User = require('./User.js')
const Oauth = require('./Oauth.js')
const Team = require('./Team.js')
const Match = require('./Match.js')
const Round = require('./Round.js')
const Prediction = require('./Prediction.js')

// Match
Match.belongsTo(Round)
Match.belongsTo(Team, {
  foreignKey: 'clubTeamId'
})
Match.hasMany(Prediction, {
  onDelete: 'cascade',
})
// Oauth
Oauth.belongsTo(User)

// Prediction
Prediction.belongsTo(Match)
Prediction.belongsTo(User)

// Round
Round.hasMany(Match, {
  onDelete: 'cascade',
})

// Team
Team.hasMany(Match, {
  foreignKey: 'clubTeamId',
  onDelete: 'cascade',
})

// User
User.hasMany(Oauth, {
  onDelete: 'cascade',
})
User.hasMany(Prediction, {
  onDelete: 'cascade',
})

module.exports = {
  User,
  Team,
  Match,
  Oauth,
  Prediction,
  Round
}
