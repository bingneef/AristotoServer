const Sequelize = require('sequelize');
const database = require('../databaseConnection');
const SequelizeTokenify = require('sequelize-tokenify');
const env = require('../config/env');
const crypto = require('crypto');

User = database.define('users',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    avatarUrl: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    apiToken: {
      type: Sequelize.STRING,
      unique: true
    },
    active: {
      type: Sequelize.BOOLEAN
    }
  });

SequelizeTokenify.tokenify(User, {
  field: 'apiToken',
  length: '24'
});

module.exports = User
