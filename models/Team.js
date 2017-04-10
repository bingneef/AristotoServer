const Sequelize = require('sequelize')
const database = require('../databaseConnection')

const Team = database.define('teams',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING
    }
  }
)

module.exports = Team
