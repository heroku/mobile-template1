'use strict';

exports.up = function(knex, Promise) {
  return knex.schema('users').addColumn('points', 'integer').default(0);
};

exports.down = function(knex, Promise) {
  
};
