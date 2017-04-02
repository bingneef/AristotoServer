jsonfile = require('jsonfile');

file = __dirname + '/env.json';
if ( typeof __TEST__ !== 'undefined' && __TEST__ ) {
  file = __dirname + '/env-test.json';
}

env = jsonfile.readFileSync(file);


module.exports = env
