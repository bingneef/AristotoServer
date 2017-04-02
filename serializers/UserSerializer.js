const db = require('../databaseConnection');

const scheme = {
  exclude: ['active', '@pk', '@fk', '@auto']
};

module.exports = scheme
