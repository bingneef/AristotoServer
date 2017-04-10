/* eslint-env node, jest */
const sequelize     = require('../../databaseConnection')
const Round         = require('../../models').Round
const RoundFactory  = require('../factory/RoundFactory')

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
    expect(Object.keys(Round.associations)).toEqual(['matches'])
  })

  test('attributes', () => {
    expect(Object.keys(Round.attributes)).toEqual(
      [
        'id',
        'visible',
        'value',
        'createdAt',
        'updatedAt'
      ]
    )
  })
})

describe('#defaultScope', async () => {
  let a
  let b
  let c

  beforeEach(async (done) => {
    a = await RoundFactory.create()
    b = await RoundFactory.create()
    c = await RoundFactory.create({ visible: false })
    done()
  })

  test('visible: true', async () => {
    const rounds = await Round.findAll({ attributes: ['id'] })
    expect(rounds.length).toEqual(2)
    expect(rounds.map(round => round.id)).toEqual([a.id, b.id])
  })

  test('unscoped', async () => {
    const rounds = await Round.unscoped().findAll({ attributes: ['id'] })
    expect(rounds.length).toEqual(3)
    expect(rounds.map(round => round.id)).toEqual([a.id, b.id, c.id])
  })
})
