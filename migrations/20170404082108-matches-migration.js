module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'matches',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        active: {
          type: Sequelize.BOOLEAN
        },
        clubTeamId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'teams',
            key: 'id'
          }
        },
        opponentName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        isHome: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        homeScore: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false
        },
        awayScore: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false
        },
        roundId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'rounds',
            key: 'id'
          }
        },
        playedAt: {
          type: Sequelize.DATE
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        }
      },
      {
        engine: 'InnoDB',
        charset: 'latin1'
      }
    )
  },

  down: queryInterface => queryInterface.dropTable('matches')
};
