/* eslint-env node, jest */
const Match = require('../../models').Match

describe('Database properties', () => {
  test('associations', () => {
    expect(Object.keys(Match.associations)).toEqual(['round', 'predictions'])
  })

  test('attributes', () => {
    expect(Object.keys(Match.attributes)).toEqual(
      [
        'id',
        'active',
        'clubTeamId',
        'opponentName',
        'isHome',
        'homeScore',
        'awayScore',
        'roundId',
        'playedAt',
        'createdAt',
        'updatedAt',
        'teamId'
      ]
    )
  })
})
