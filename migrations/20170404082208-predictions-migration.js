module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'predictions',
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
        matchId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'matches',
            key: 'id'
          }
        },
        value: {
          type: Sequelize.ENUM('home', 'draw', 'away'),
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

  down: queryInterface => queryInterface.dropTable('predictions')
};
