/* eslint-env node, jest */
const MatchSerializer   = require('./../../serializers/MatchSerializer')
const MatchFactory      = require('../factory/MatchFactory')
const PredictionFactory = require('../factory/PredictionFactory')
const UserFactory       = require('../factory/UserFactory')
const Match             = require('./../../models').Match
const Team              = require('./../../models').Team
const Prediction        = require('./../../models').Prediction
const sequelize         = require('../../databaseConnection')

beforeEach(async (done) => {
  await sequelize.sync(
    {
      force: true
    }
  )
  done()
})

test('Scheme', async () => {
  expect(Object.keys(MatchSerializer)).toEqual(
    [
      'include',
      'exclude',
      'as',
      'assoc'
    ]
  )

  expect(MatchSerializer.include).toEqual(
    [
      '@all',
      'team',
      'predictions'
    ]
  )

  expect(MatchSerializer.exclude).toEqual(
    [
      'active',
      '@fk',
      '@auto'
    ]
  )

  expect(MatchSerializer.as).toEqual(
    {
      team: 'clubTeam',
      predictions: 'myPrediction'
    }
  )

  expect(MatchSerializer.assoc).toEqual(
    {
      predictions: {
        exclude: [
          '@fk',
          '@auto'
        ]
      },
      team: {
        exclude: [
          '@fk',
          '@auto'
        ]
      }
    }
  )
})

test('Without a team nor prediction', async () => {
  const user = await UserFactory.create()
  let a = await MatchFactory.create()
  await PredictionFactory.create({ userId: user.id, matchId: a.id })

  a = await Match.findOne(
    {
      id: a.id,
      include: [
        {
          model: Team
        },
        {
          model: Prediction,
          where: {
            userId: user.id
          },
          required: false
        }
      ]
    }
  )
  const serializedMatch = a.serialize(MatchSerializer)
  expect(Object.keys(serializedMatch)).toEqual(
    ['id', 'opponentName', 'isHome', 'homeScore', 'awayScore', 'playedAt', 'clubTeam', 'myPrediction']
  )
})
