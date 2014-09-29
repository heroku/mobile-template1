module.exports = function(bookshelf) {
	var User = bookshelf.Model.extend({
			tableName: 'users'
	});

	var Question = bookshelf.Model.extend({
			tableName: 'questions'
	});

	var Answer = bookshelf.Model.extend({
			tableName: 'answers'
	});


	return {
		User: User,
		Question: Question,
		Answer: Answer
	}
}
