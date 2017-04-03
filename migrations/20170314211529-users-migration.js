module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'users',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        lastName: {
          type: Sequelize.STRING
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        apiToken: {
          type: Sequelize.STRING,
          unique: true
        },
        active: {
          type: Sequelize.BOOLEAN
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

  down: queryInterface => queryInterface.dropAllTables()
};
