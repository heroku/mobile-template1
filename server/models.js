module.exports = function(bookshelf) {
	var User = bookshelf.Model.extend({
			tableName: 'users'
	});

	var Question = bookshelf.Model.extend({
			tableName: 'questions'
	});

	return {
		User: User,
		Question: Question
	}
}
