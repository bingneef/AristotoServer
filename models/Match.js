const Sequelize = require('sequelize')
const database = require('../databaseConnection')

const Match = database.define('matches',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    active: {
      type: Sequelize.BOOLEAN
    },
    clubTeamId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'teams',
        key: 'id'
      }
    },
    opponentName: {
      type: Sequelize.STRING
    },
    isHome: {
      type: Sequelize.BOOLEAN
    },
    homeScore: {
      type: Sequelize.INTEGER
    },
    awayScore: {
      type: Sequelize.INTEGER
    },
    roundId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'rounds',
        key: 'id'
      }
    },
    playedAt: {
      type: Sequelize.DATE
    },
  }
)

module.exports = Match
