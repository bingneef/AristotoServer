// eslint-disable-next-line import/no-extraneous-dependencies, global-require
const faker         = require('../../node_modules/faker')
const Match         = require('../../models').Match
const TeamFactory   = require('./TeamFactory')
const RoundFactory  = require('./RoundFactory')

class MatchFactory {
  static async params (override) {
    let clubTeamId = override.clubTeamId
    if (clubTeamId === undefined) {
      const clubTeam = await TeamFactory.create()
      clubTeamId = clubTeam.id
    }

    let roundId = override.roundId
    if (roundId === undefined) {
      const round = await RoundFactory.create()
      roundId = round.id
    }

    let active = override.active
    if (active === undefined) {
      active = true
    }

    let isHome = override.isHome
    if (isHome === undefined) {
      isHome = true
    }

    return {
      active,
      clubTeamId,
      opponentName: override.opponentName || faker.name.firstName(),
      isHome,
      homeScore: override.homeScore || 0,
      awayScore: override.awayScore || 0,
      playedAt: new Date(),
      roundId
    }
  }

  static async create (params) {
    const match = await Match.create(await MatchFactory.params(params || {}))
    return match
  }
}

module.exports = MatchFactory
