/* global __TEST__ */
const path      = require('path')
const jsonfile  = require('jsonfile')

let dbConfig

if (typeof __TEST__ !== 'undefined' && __TEST__) {
  dbConfig = jsonfile.readFileSync(path.join(__dirname, '/config-test.json'))
} else {
  dbConfig = jsonfile.readFileSync(path.join(__dirname, '/config.json'))
}

module.exports = dbConfig
