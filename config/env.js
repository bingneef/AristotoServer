/* global __TEST__ */
const path      = require('path');
const jsonfile = require('jsonfile');

var dbConfig = jsonfile.readFileSync(path.join(__dirname, '/env.json'));
if (typeof __TEST__ !== 'undefined' && __TEST__) {
  dbConfig = jsonfile.readFileSync(path.join(__dirname, '/env-test.json'));
}

module.exports = dbConfig;
