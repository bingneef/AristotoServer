const scheme = {
  include: ['@all', 'team'],
  exclude: ['active', '@fk', '@auto'],
  as: {
    team: 'clubTeam'
  },
  assoc: {
    team: {
      exclude: ['@fk', '@auto']
    }
  }
};

module.exports = scheme
