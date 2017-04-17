const scheme = {
  include: ['@all', 'team', 'predictions'],
  exclude: ['active', '@fk', '@auto'],
  as: {
    team: 'clubTeam',
    predictions: 'myPrediction'
  },
  assoc: {
    team: {
      exclude: ['@fk', '@auto']
    },
    predictions: {
      exclude: ['@fk', '@auto']
    }
  }
};

module.exports = scheme
