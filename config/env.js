/* global __TEST__ */
const path      = require('path')
const jsonfile  = require('jsonfile')

let dbConfig
if (typeof __TEST__ !== 'undefined' && __TEST__) {
  dbConfig = jsonfile.readFileSync(path.join(__dirname, '/env-test.json'))
} else {
  dbConfig = jsonfile.readFileSync(path.join(__dirname, '/env.json'))
}

module.exports = dbConfig
