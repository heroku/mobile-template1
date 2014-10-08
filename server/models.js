module.exports = function(bookshelf) {
  var User = bookshelf.Model.extend({
    tableName: 'users',

    incrPoints: function(val) {
      this.set('points', this.get('points') + val);
      return this.save();
    },

    initialize: function() {
      this.on('creating', this.set_admin);
    },

    set_admin: function() {
      var self = this;
      return bookshelf.knex('users').count().then(function(result) {
        if (result[0] && result[0].count == 0) {
          console.log("Marking first user " + self.get("email") + " as admin");
          self.set('is_admin', true);
        }
      });
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

    return bookshelf.knex('questions').update({
      'show': knex.raw('(id=' + question_id + ')')
    }).then(function() {
      res.send('OK');
    }).catch(function(err) {
      console.log("Error ", err);
      res.status(500).send(err);
    });
  }

  function next_question(req, res, next) {
    var idWhere = '(select min(id) from questions where (show = false or show is null) and id > (select max(id) from questions where show = true))';
    return bookshelf.knex('questions').update({
        'show': bookshelf.knex.raw('(id = ' + idWhere + ')')
      })
      .then(function() {
        res.send('OK');
      }).catch(next);
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
      knex('users').update({
        points: 0
      }).then(function() {
        knex('questions').update({
          show: false
        }).then(function() {
          knex('questions').where({
            question: 'start'
          }).update({
            show: true
          }).then(function() {
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