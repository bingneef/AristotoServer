const Sequelize = require('sequelize');
const dbCredentials = require('./config/dbConfig');
const SequelizeToJson = require('sequelize-to-json');

sequelize = new Sequelize(
  dbCredentials.database, 
  dbCredentials.username, 
  dbCredentials.password,
  {
    host: 'localhost',
    dialect: dbCredentials.dialect,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
    define: {
      classMethods: {
        serialize (data, scheme, options) {
          return SequelizeToJson.serializeMany(data, this, scheme, options);
        }
      },
      instanceMethods: {
        serialize (scheme, options) {
          return (new SequelizeToJson(this.Model, scheme, options)).serialize(this);
        }
      }
    }
  }
);

sequelize
  .authenticate()
  .then( () => {
    console.log('Connection with database established');
  })
  .catch( (err) => {
    console.log('Error connecting to the database: ' + err);
  });

module.exports = sequelize
