module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'roundScores',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        roundId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'rounds',
            key: 'id'
          }
        },
        value: {
          type: Sequelize.INTEGER,
          allowNull: false
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

  down: queryInterface => queryInterface.dropTable('roundScores')
};
