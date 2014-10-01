'use strict';

exports.up = function(knex, Promise) {
	return knex('questions').insert({question:'end',answers:[],answer_index:1});
};

exports.down = function(knex, Promise) {
  
};
