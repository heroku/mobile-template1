'use strict';

exports.up = function(knex, Promise) {
	var schema = knex.schema;

	return Promise.all([
		schema.hasTable('users').then(function(exists) {
			if (!exists) {
				return schema.createTable('users', function(table) {
			      table.increments('id');
			      table.string('email').notNullable();
			      table.string('password').notNullable();
			      table.timestamps();
			    });
			} else {
				return schema;
			}
		}),
		schema.hasTable('questions').then(function(exists) {
			if (!exists) {
				return schema.createTable('questions', function(table) {
			      	table.increments('id');
			      	table.text('question');
			      	table.json('answers');
			      	table.boolean('show');
				      	table.timestamps();
				});
			} else {
				return schema;
			}
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.dropTable('users'),
		knex.schema.dropTable('questions')
	]);
};
