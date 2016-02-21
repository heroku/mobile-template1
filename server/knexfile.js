// Update with your config settings.
var config = require('./config');

module.exports = {

  development: {
    client: 'pg',
    connection: config.db_url
  },

  production: {
    client: 'pg',
    connection: config.db_url
  }

};
