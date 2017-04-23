const passport          = require('koa-passport')
const FacebookStrategy  = require('passport-facebook').Strategy
const GoogleStrategy    = require('passport-google-oauth2').Strategy
const Oauth             = require('./models').Oauth
const env               = require('./config/env')

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
      Oauth.getUserOfToken(
        'facebook',
        profile.id,
        profile.name.givenName,
        profile.name.familyName,
        profile.emails[0].value,
        profile.photos[0].value,
        done
      )
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
      Oauth.getUserOfToken(
        'google',
        profile.id,
        profile.name.givenName,
        profile.name.familyName,
        profile.email,
        profile.photos[0].value,
        done
      )
    }
  )
)

module.exports = passport
