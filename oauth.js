const passport = require('koa-passport')
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy
const User = require('./models').User
const Oauth = require('./models').Oauth
const env = require('./config/env')

const setAvatarUrl = async (user, firstName, lastName, avatarUrl, done) => {
  user = await user.update({
    firstName,
    lastName,
    avatarUrl
  })

  return done(null, user)
}

/*
/ 1: Check if a oauth exists
/ 2: If Array, pick the first (Sequelize can return an array..)
/ 3: Get the user of the oAuth and return user
/ 4: If no user found, findOrCreate by email
/ 5: Add oAUth to user and return user
*/
const getUserOfToken = async (type, identifier, firstName, lastName, email, avatarUrl, done) => {
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
    return setAvatarUrl(user, firstName, lastName, avatarUrl, done)
  }

  user = await User.findOrCreate({
    where: {
      email
    },
    defaults: {
      active: true
    }
  })

  if (Array.isArray(user)) {
    user = user[0]
  }

  user = await user.addOauth(oauth)
  await setAvatarUrl(user, firstName, lastName, avatarUrl, done)

  return user
}

passport.use(
  new FacebookStrategy(
    {
      clientID: env.oauth.facebook.clientID,
      clientSecret: env.oauth.facebook.clientSecret,
      callbackURL: `${env.serverOrigin}/auth/facebook/callback`,
      profileFields: ['id', 'email', 'displayName', 'name', 'photos'],
      scope: ['email'],
      enableProof: true
    },
    (accessToken, refreshToken, profile, done) => {
      getUserOfToken('facebook', profile.id, profile.name.givenName, profile.name.familyName, profile.emails[0].value, profile.photos[0].value, done)
    }
  )
)

passport.use(
  new GoogleStrategy(
    {
      clientID: env.oauth.google.clientID,
      clientSecret: env.oauth.google.clientSecret,
      callbackURL: `${env.serverOrigin}/auth/google/callback`,
      scope: ['https://www.googleapis.com/auth/userinfo.email']
    },
    (accessToken, refreshToken, profile, done) => {
      getUserOfToken('google', profile.id, profile.name.givenName, profile.name.familyName, profile.email, profile.photos[0].value, done)
    }
  )
)

module.exports = passport
