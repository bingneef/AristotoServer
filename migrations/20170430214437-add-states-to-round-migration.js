module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'rounds',
      'state',
      {
        type: Sequelize.ENUM('preparing', 'published', 'finished', 'invalid'),
        allowNull: false,
        default: 'preparing'
      }
    )

    queryInterface.removeColumn(
      'rounds',
      'visible'
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'rounds',
      'state'
    )

    queryInterface.addColumn(
      'rounds',
      'visible',
      {
        type: Sequelize.BOOLEAN
      }
    )
  }
};
