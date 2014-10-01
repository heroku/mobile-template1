'use strict';
exports.up = function(knex, Promise) {
	var qs = [
		{'question':'start',
		 'answers': ['start'],
		 'answer_index':1,
		 'show':true
		 },
		 {
		   'question':'What was Oscar the Grouch\'s original color?',
		  'answers': ['Orange', 'Red', 'Yello'],
		  'answer_index': 1
		 },
		 {
		 	question:"Who wrote Johnny Cash's song 'A Boy Named Sue'?",
		 	answers: ['Rosanne Cash','Dolly Parton','Shel Silverstein'],
		 	answer_index: 3
		 },
		 {
		 	question:"Who died abord the plane named 'American Pie'?",
		 	answers: ['Don McLean','John Denver','Buddy Holly'],
		 	answer_index: 3
		 },
		 {
		 	question:'How old was Mozart when he composed his first piece?',
		 	answers: ['5','7','10'],
		 	answer_index: 1
		 },
		 {'question':'Who was the first president of the United States?',
		 'answers': ['Thomas Jefferson', 'George Jefferson', 'George Washington'],
		 'answer_index' : 3
		 },
		 {
		 	question:'Whose song was used to tune the compression algorithms for the mp3 format?',
		 	answers: ['Elvis Presley','Susanne Vega', 'Whitney Houston'],
		 	answer_index: 2
		 },
		 {
		 	question:'Which planet has the tallest mountains?',
		 	answers: ['Earth','Mars','Jupiter'],
		 	answer_index: 2
		 },
		 {
		 	question:'Which country did Stalin invade in 1939?',
		 	answers: ['Poland','Finland','Ukraine'],
		 	answer_index: 1
		 },
		 {
		 	question:'Which US general was driven out of the Phillipines in 1942?',
		 	answers: ['Marshall','MacArthur','Eisenhower','Bradley'],
		 	answer_index: 2
		 },
		 {
		 	question:'Which historical figure lent his name to an XML parser?',
		 	answers: ['Herodotus','Astylos','Artemis','Xerces'],
		 	answer_index: 4
		 },
		 {
		 	question:'Who was the shortest U.S. President?',
		 	answers: ['James Madison', 'Howard Taft','Milard Filmore',],
		 	answer_index: 1
		 },
		 {
		 	question:'The city of Mayfield was annexed by Palo Alto in what year?',
		 	answers: ['1925','1940','1958','1967'],
		 	answer_index: 1
		 },
		 {
		 	question:'Which US president attended the very first Big Game?',
		 	answers: ['Woodrow Wilson','Franklin Roosevelt','John Kennedy','Herbert Hoover'],
		 	answer_index: 4
		 },
		 {
		 	question:"What was the subject of Cindy Lauper\s song 'She Bop'?",
		 	answers: ['teen pregnancy','masturbation','school dances'],
		 	answer_index: 2
		 }
	];

	return Promise.map(qs, function(question) {
		console.log("Creating ", question.question);
		question.answers = JSON.stringify(question.answers);
		return knex('questions').debug().insert(question);  
	});
};

exports.down = function(knex, Promise) {
   return knex('questions').del();  
};
