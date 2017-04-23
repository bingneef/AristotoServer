const Sequelize = require('sequelize')
const database  = require('../databaseConnection')
const User      = require('./User')

const setUserData = async (user, firstName, lastName, avatarUrl, done) => {
  user = await user.update({
    firstName,
    lastName,
    avatarUrl,
    active: true
  })

  return done(null, user)
};

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
  },
  {
    classMethods: {
      async getUserOfToken (type, identifier, firstName, lastName, email, avatarUrl, done) {
        /*
        / 1: Check if a oauth exists
        / 2: If Array, pick the first (Sequelize can return an array..)
        / 3: Get the user of the oAuth and return user
        / 4: If no user found, findOrCreate by email
        / 5: Add oAUth to user and return user
        */
        let oauth = await Oauth.findOrCreate({
          where: {
            identifier,
            type
          }
        })

        if (Array.isArray(oauth)) {
          oauth = oauth[0]
        }

        let user = await oauth.getUser()

        if (user) {
          return setUserData(user, firstName, lastName, avatarUrl, done)
        }


        user = await User.findOrCreate({
          where: {
            email
          }
        })

        if (Array.isArray(user)) {
          user = user[0]
        }

        user = await user.addOauth(oauth)
        await setUserData(user, firstName, lastName, avatarUrl, done)

        return null
      }
    }
  }
)

module.exports = Oauth
