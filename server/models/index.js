var config = require('../config');
var models;

if (config.orm === 'bookshelf') {
    var knex = require('knex')(config.knex_options);
    var bookshelf = require('bookshelf')(knex)
    models = require('./models_bookshelf')(bookshelf);
}
else {
    var Sequelize = require('sequelize');
    models = require('./models_sequelize')(new Sequelize(config.db_url));
}

module.exports = models;