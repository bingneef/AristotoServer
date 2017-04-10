const Team            = require('../models').Team
const TeamSerializer  = require('../serializers/TeamSerializer')

class TeamController {
  static async getTeams (ctx) {
    const teams = await Team.findAll()
    ctx.body = Team.serialize(teams, TeamSerializer)
  }
}

module.exports = TeamController
