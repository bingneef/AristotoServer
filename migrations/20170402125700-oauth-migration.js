module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'oauths',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        type: {
          type: Sequelize.STRING,
          allowNull: false
        },
        identifier: {
          type: Sequelize.STRING,
          allowNull: false
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          }
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

  down: queryInterface => queryInterface.dropTable('oauths')
};
