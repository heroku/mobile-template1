var config = require('./config'),
  knex = require('knex')(config.knex_options),
  Promise = require('knex/lib/promise');

var startq = {
  'question': 'start',
  'answers': JSON.stringify(['start']),
  'answer_index': 1,
  'show': true
};

var qs = [
{
  'question': 'What was Oscar the Grouch\'s original color?',
  'answers': ['Orange', 'Red', 'Yello'],
  'answer_index': 1
}, {
  question: "Who wrote Johnny Cash's song 'A Boy Named Sue'?",
  answers: ['Rosanne Cash', 'Dolly Parton', 'Shel Silverstein'],
  answer_index: 3
}, {
  question: "Who died abord the plane named 'American Pie'?",
  answers: ['Don McLean', 'John Denver', 'Buddy Holly'],
  answer_index: 3
}, {
  question: 'How old was Mozart when he composed his first piece?',
  answers: ['5', '7', '10'],
  answer_index: 1
}, {
  'question': 'Who was the first president of the United States?',
  'answers': ['Thomas Jefferson', 'George Jefferson', 'George Washington'],
  'answer_index': 3
}, {
  question: 'Whose song was used to tune the compression algorithms for the mp3 format?',
  answers: ['Elvis Presley', 'Susanne Vega', 'Whitney Houston'],
  answer_index: 2
}, {
  question: 'Which planet has the tallest mountains?',
  answers: ['Earth', 'Mars', 'Jupiter'],
  answer_index: 2
}, {
  question: 'Which country did Stalin invade in 1939?',
  answers: ['Poland', 'Finland', 'Ukraine'],
  answer_index: 1
}, {
  question: 'Which US general was driven out of the Phillipines in 1942?',
  answers: ['Marshall', 'MacArthur', 'Eisenhower', 'Bradley'],
  answer_index: 2
}, {
  question: 'Which historical figure lent his name to an XML parser?',
  answers: ['Herodotus', 'Astylos', 'Artemis', 'Xerces'],
  answer_index: 4
}, {
  question: 'Who was the shortest U.S. President?',
  answers: ['James Madison', 'Howard Taft', 'Milard Filmore', ],
  answer_index: 1
}, {
  question: "The Millenium Falcon made the Kessel run in how long?",
  answers: ['8 nanoclicks', '3.7 light-seconds', '12 parsecs'],
  answer_index: 3
}, {
  question: 'The city of Mayfield was annexed by Palo Alto in what year?',
  answers: ['1925', '1940', '1958', '1967'],
  answer_index: 1
}, {
  question: 'Which US president attended the very first Big Game?',
  answers: ['Woodrow Wilson', 'Franklin Roosevelt', 'John Kennedy', 'Herbert Hoover'],
  answer_index: 4
}, {
  question: "Who turned down the lead for the movie 'American Beauty'?",
  answers: ['Alan Alda', 'Chevy Chase', 'Robert Downey Jr.'],
  answer_index: 2
}, {
  question: "Who was really 'Deep Throat'?",
  answers: ['John Dean', 'Alexander Haig', 'Mark Felt'],
  answer_index: 3
}, {
  question: "Who played Mr. Freeze?",
  answers: ['Arnold Schwarzenegger', 'Jean-Claude Van Damme', 'Vin Diesel', 'Michael Keaton'],
  answer_index: 1
}, {
  question: "'Salacious Crumb' is a character from what movie?",
  answers: ['Goonies', 'Star Wars', 'Battlefield Earth'],
  answer_index: 2
}, {
  question: "What is an SP in Scientology?",
  answers: ["social precom", "sound prescence", "suppressive person"],
  answer_index: 3
}, {
  question: "Much of the plutonium for the first atomic bomb was produced in what state?",
  answers: ['Tennessee', 'New Mexico', 'Nevada', 'Colorado'],
  answer_index: 1
}];

knex('questions').del().then(function() {
  return knex('questions').insert(startq);
}).then(function() {
  return Promise.map(qs, function(question) {
    console.log("Creating ", question.question);
    question.answers = JSON.stringify(question.answers);
    return knex('questions').insert(question);
  });
}).then(function() {
  knex('questions').insert({
    question: 'end',
    answers: '["end"]',
    answer_index: 1
  }).then(function() {
    process.exit(0);
  });
});