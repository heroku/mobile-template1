'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.integer('points').defaultTo(0);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('points');
  });

};