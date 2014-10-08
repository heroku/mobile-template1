var Promise = require('bluebird');

module.exports = function(bookshelf) {
  var knex = bookshelf.knex;
  // only output vanilla objects, not model instances
  var jsonify = function(model){
    if (model && model.toJSON) {
      model = model.toJSON();
    }
    return Promise.resolve(model);
  };

  // users
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

  User.objects = {
    getById: function(id){
      return new User({id: id}).fetch().then(jsonify);
    },

    getByEmail: function(email) {
      return new User({email: email}).fetch().then(jsonify);
    },

    getByToken: function(token) {
      return new User({token: token}).fetch().then(jsonify);
    },

    create: function(attrs){
      return new User(attrs).save().then(jsonify);
    },

    update: function(id, attrs){
      return new User({id: id}).save(attrs, {patch: true}).then(jsonify);
    },

    incrementPoints: function(id, pts) {
      return new User({id: id}).fetch().then(function(u){
        return u.incrPoints(pts);
      });
    }
  };

  // questions
  var Question = bookshelf.Model.extend({
    tableName: 'questions'
  });

  Question.objects = {
    getById: function(id){
      return new Question({id: id}).fetch().then(jsonify);
    },

    create: function(attrs){
      return new Question(attrs).save().then(jsonify);
    },

    update: function(id, attrs){
      return new Question({id: id}).save(attrs, {patch: true}).then(jsonify);
    },

    query: function(columns, attrs){
      columns = columns || '*';
      return Question.query({select: columns}).where(attrs).fetchAll().then(jsonify);
    }
  };

  // answers
  var Answer = bookshelf.Model.extend({
    tableName: 'answers'
  });

  Answer.objects = {
    getById: function(id){
      return new Answer({id: id}).fetch().then(jsonify);
    },

    create: function(attrs){
      return new Answer(attrs).save().then(jsonify);
    },

    update: function(id, attrs){
      return new Answer({id: id}).save(attrs, {patch: true}).then(jsonify);
    },

    query: function(columns, attrs){
      columns = columns || '*';
      return Answer.query({select: select}).where(attrs).fetchAll().then(jsonify);
    }
  };

  // http handlers
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
    var idWhere = '(select min(id) from questions where show = false and id > (select max(id) from questions where show = true))';
    return bookshelf.knex('questions').update({
        'show': knex.raw('(id = ' + idWhere + ')')
      })
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