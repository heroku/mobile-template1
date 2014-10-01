module.exports = function(bookshelf) {
	var User = bookshelf.Model.extend({
			tableName: 'users',

			incrPoints: function(val) {
			    this.set('points', this.get('points') + val);
				return this.save();
			}
	});

	var Question = bookshelf.Model.extend({
			tableName: 'questions'
	});

	var Answer = bookshelf.Model.extend({
			tableName: 'answers'
	});

	function activate_question(req, res, next) {
		var question_id = req.params.questionId;
		console.log("activating question ", question_id);

		return bookshelf.knex('questions').update({'show': knex.raw('(id=' + question_id + ')')}).then(function() {
			res.send('OK');
		}).catch(function(err) {
			console.log("Error ", err);
			res.status(500).send(err);
		});
	}

	function next_question(req, res, next) {
		return bookshelf.knex('questions').update({'show': knex.raw('(id = (select id from questions where show = true) + 1)')})
			.then(function() {
				res.send('OK');
			});
	}

	function leaders(req, res, next) {
		return bookshelf.knex('users').orderBy('points', 'desc')
				.select('*').then(function(rows) {
			res.json(rows);
		});
	}

	function clear_leaders(req, res, next) {
		var knex = bookshelf.knex;
		knex('answers').del().then(function() {
			knex('users').update({points:0}).then(function() {
				knex('questions').update({show:false}).then(function() {
					knex('questions').where({question:'start'}).update({show:true}).then(function() {
						res.send('OK');
					});
				});
			});
		}).catch(function(err) {
			next(err);
		});
	}

	return {
		User: User,
		Question: Question,
		Answer: Answer,
		activate_question: activate_question,
		next_question: next_question,
		leaders: leaders,
		clear_leaders: clear_leaders
	}
}
