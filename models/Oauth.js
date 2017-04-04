const Sequelize = require('sequelize')
const database = require('../databaseConnection')

const Oauth = database.define('oauths',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: Sequelize.STRING
    },
    identifier: {
      type: Sequelize.STRING
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }
)

module.exports = Oauth
