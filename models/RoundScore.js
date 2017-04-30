const Sequelize   = require('sequelize')
const database    = require('../databaseConnection')

const RoundScore = database.define('roundScores',
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
      type: Sequelize.INTEGER
    }
  }, {
    classMethods: {
      calculateScore (correct, wrong) {
        if (wrong > 2 || (correct + wrong) < 5) {
          return 0
        }

        let score = 3 ** correct

        if (wrong === 1) {
          score /= 2
        } else if (wrong === 2) {
          score /= 3
        }

        return Math.ceil(score)
      },
      cleanUp () {
        RoundScore.destroy({
          where: {
            userId: null
          }
        })
      }
    }
  }
)

module.exports = RoundScore
