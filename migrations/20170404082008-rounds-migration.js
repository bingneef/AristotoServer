module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'rounds',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        visible: {
          type: Sequelize.BOOLEAN
        },
        value: {
          type: Sequelize.INTEGER,
          allowNull: false
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

  down: queryInterface => queryInterface.dropTable('rounds')
};
