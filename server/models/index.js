var config = require('../config');
var models;

if (config.orm === 'bookshelf') {
    var knex = require('knex')(config.knex_options);
    models = require('./models_bookshelf')(knex);
}
else {
    var Sequelize = require('sequelize');
    models = require('./models_sequelize')(new Sequelize(config.db_url, {
        logging: config.SQL_DEBUG
    }));
}

module.exports = models;