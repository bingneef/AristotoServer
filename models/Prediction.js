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
      // eslint-disable-next-line new-cap
      type: Sequelize.ENUM('HOME', 'DRAW', 'AWAY')
    }
  }
)

module.exports = Prediction
