jsonfile = require('jsonfile');

file = __dirname + '/config.json';
if ( typeof __TEST__ !== 'undefined' && __TEST__ ) {
  file = __dirname + '/config-test.json';
}
dbConfig = jsonfile.readFileSync(file);


module.exports = dbConfig
