module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'stats',
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
        period: {
          type: Sequelize.ENUM('overall', 'week', 'month'),
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

  down: queryInterface => queryInterface.dropTable('stats')
};
