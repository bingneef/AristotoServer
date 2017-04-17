const Sequelize = require('sequelize')
const database = require('../databaseConnection')

const Prediction = database.define('predictions',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    matchId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'matches',
        key: 'id'
      }
    },
    value: {
      type: Sequelize.ENUM,
      values: ['home', 'draw', 'away']
    }
  }
)

module.exports = Prediction
