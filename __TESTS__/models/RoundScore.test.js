/* eslint-env node, jest */
const sequelize     = require('../../databaseConnection')
const RoundScore     = require('../../models').RoundScore
const RoundScoreFactory  = require('../factory/RoundScoreFactory')

beforeEach(async (done) => {
  await sequelize.sync(
    {
      force: true
    }
  )
  done()
})

describe('Database properties', () => {
  test('associations', () => {
    expect(Object.keys(RoundScore.associations)).toEqual(['round', 'user'])
  })

  test('attributes', () => {
    expect(Object.keys(RoundScore.attributes)).toEqual(
      [
        'id',
        'userId',
        'roundId',
        'value',
        'createdAt',
        'updatedAt'
      ]
    )
  })
})

describe('#calculateScore', () => {
  it('returns the correct score', () => {
    expect(RoundScore.calculateScore(5, 0)).toEqual(243)
    expect(RoundScore.calculateScore(5, 1)).toEqual(122)
    expect(RoundScore.calculateScore(5, 2)).toEqual(81)
    expect(RoundScore.calculateScore(4, 1)).toEqual(41)
    expect(RoundScore.calculateScore(4, 2)).toEqual(27)
    expect(RoundScore.calculateScore(3, 2)).toEqual(9)
  })

  it('return 0 if more then 2 errors', () => {
    expect(RoundScore.calculateScore(10, 3)).toEqual(0)
  })

  it('return 0 if less than 5 predictions', () => {
    expect(RoundScore.calculateScore(4, 0)).toEqual(0)
  })
})

describe('#cleanUp', async () => {
  it('deletes the RoundScore object without an user', async () => {
    const roundScoreA = await RoundScoreFactory.create()
    await RoundScoreFactory.create({ userId: null })

    let roundScores = await RoundScore.findAll()
    expect(roundScores.length).toEqual(2)

    await RoundScore.cleanUp()

    roundScores = await RoundScore.findAll()
    expect(roundScores.length).toEqual(1)
    expect(roundScores[0].id).toEqual(roundScoreA.id)
  })
})
