const Sequelize = require('sequelize')
const database = require('../databaseConnection')

const Round = database.define('rounds',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    visible: {
      type: Sequelize.BOOLEAN
    },
    value: {
      type: Sequelize.INTEGER
    }
  }
)

module.exports = Round
