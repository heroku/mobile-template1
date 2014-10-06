'use strict';

exports.up = function(knex, Promise) {
  var schema = knex.schema;

  return Promise.all([
    schema.hasTable('users').then(function(exists) {
      if (!exists) {
        console.log("Creating users table");
        return schema.createTable('users', function(table) {
          table.increments('id');
          table.string('name').notNullable().index();
          table.string('email').notNullable();
          table.string('crypted_password').notNullable();
          table.string('token').index();
          table.boolean('is_admin').defaultTo(false);
          table.timestamps();
          console.log("done with users table");
        });
      } else {
        return schema;
      }
    }),
    schema.hasTable('questions').then(function(exists) {
      if (!exists) {
        console.log("Creating questions table");
        return schema.createTable('questions', function(table) {
          table.increments('id');
          table.text('question');
          table.json('answers');
          table.integer('answer_index');
          table.boolean('show');
          table.timestamps();
          console.log("done with users table");
        });
      } else {
        return schema;
      }
    }),
    schema.hasTable('answers').then(function(exists) {
      if (!exists) {
        console.log("Creating answers table");
        return schema.createTable('answers', function(table) {
          table.increments('id');
          table.integer('user_id');
          table.text('question_id');
          table.integer('answer_index');
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
    knex.schema.dropTable('questions'),
    knex.schema.dropTable('answers')
  ]);
};