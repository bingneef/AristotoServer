const Match       = require('./Match.js')
const Oauth       = require('./Oauth.js')
const Prediction  = require('./Prediction.js')
const Round       = require('./Round.js')
const RoundScore  = require('./RoundScore.js')
const Team        = require('./Team.js')
const User        = require('./User.js')

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

// Round
Round.hasMany(RoundScore, {
  onDelete: 'cascade',
})

// RoundScore
RoundScore.belongsTo(Round, {
  onDelete: 'cascade',
})
RoundScore.belongsTo(User, {
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
User.hasMany(RoundScore, {
  onDelete: 'cascade',
})

module.exports = {
  User,
  Team,
  Match,
  Oauth,
  Prediction,
  Round,
  RoundScore
}
