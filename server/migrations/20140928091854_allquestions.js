'use strict';
exports.up = function(knex, Promise) {
	var qs = [
		{'question':'Who was the first president of the United States?',
		 'answers': ['Thomas Jefferson', 'George Jefferson', 'George Washington'],
		 'answer_index' : 3},
		 {'question':'What is the best breed of dog?',
		  'answers': ['Chiuaua', 'Golden Retriever', 'Bulldog'],
		  'answer_index': 2}
	];

	return Promise.map(qs, function(question) {
		console.log("Creating ", question.question);
		question.answers = JSON.stringify(question.answers);
		return knex('questions').debug().insert(question);  
	});
};

exports.down = function(knex, Promise) {
   knex('questions').del();  
};
