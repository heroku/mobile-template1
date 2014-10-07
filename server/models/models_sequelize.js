var Sequelize = require('sequelize');
var _ = require('underscore');
var Q = require('q');

module.exports = function(sequelize) {

  // only output vanilla objects, not model instances
  var jsonify = function(model){
    return Q.fcall(function(){
      if (model && model.toJSON) {
        return model.toJSON();
      }
      return model;
    });
  };

  // users
  var User = sequelize.define('User', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    points: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    crypted_password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    token: Sequelize.STRING,
    is_admin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  User.objects = {
    getById: function(id){
      return User.find(id).then(jsonify);
    },

    getByEmail: function(email) {
      return User.find({where: {email: email}}).then(jsonify);
    },

    getByToken: function(token) {
      return User.find({where: {token: token}}).then(jsonify);
    },

    create: function(attrs){
      return User.create(attrs).then(jsonify);
    },

    update: function(id, attrs){
      // TODO: Model.update() only returns a count? Not the instances...
      // should be able to do this in one query.
      return User.find(id).then(function(u){
        return u.updateAttributes(attrs).then(jsonify);
      });
    }
  };

  // questions
  var Question = sequelize.define('Question', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    question: Sequelize.STRING,
    answers: Sequelize.JSON,
    answer_index: Sequelize.INTEGER,
    show: Sequelize.BOOLEAN
  }, {
    tableName: 'questions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Question.objects = {
    getById: function(id){
      return Question.find(id).then(jsonify);
    },

    create: function(attrs){
      return Question.create(attrs).then(jsonify);
    },

    update: function(id, attrs){
      return Question.find(id).then(function(q){
        return q.updateAttributes(attrs).then(jsonify);
      });
    },

    query: function(columns, attrs){
      var opts = {where: attrs};
      if (columns) {
        opts.attributes = columns;
      }
      return Question.findAll(opts).then(jsonify);
    }
  };

  // answers
  var Answer = sequelize.define('Answer', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    user_id: Sequelize.INTEGER,
    question_id: Sequelize.INTEGER,
    answer_index: Sequelize.INTEGER
  }, {
    tableName: 'answers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Answer.objects = {
    getById: function(id){
      return Answer.find(id).then(jsonify);
    },

    create: function(attrs){
      return Answer.create(attrs).then(jsonify);
    },

    update: function(id, attrs){
      return Answer.find(id).then(function(a){
        return a.updateAttributes(attrs).then(jsonify);
      });
    },

    query: function(columns, attrs){
      var opts = {where: attrs};
      if (columns) {
        opts.attributes = columns;
      }
      return Answer.findAll(opts).then(jsonify);
    }
  };

  // http handlers
  var activateQuestion = function(req, res, next){
    var id = req.params.questionId;
    return sequelize.query('UPDATE questions SET show = (id = $1)', null, {raw: true}, [id])
    .success(function(){
      res.sendStatus(200);
    })
    .error(function(){
      res.sendStatus(500);
    });
  };

  var nextQuestion = function(req, res, next){
    return sequelize.query('UPDATE questions SET show = (id = (select min(id) from questions where show = false and id > (select max(id) from questions where show = true)))', null, {raw: true})
    .success(function(){
      res.sendStatus(200);
    })
    .error(function(){
      res.sendStatus(500);
    });
  };

  var leaders = function(req, res, next){
    return User.findAll({
      order: 'points DESC',
      attributes: ['id', 'name', 'email', 'points']
    })
    .success(function(users){
      res.json(users.toJSON());
    })
    .error(function(){
      res.sendStatus(500);
    });
  };

  var clearLeaders = function(req, res, next){
    return Q.all([
      Answer.all().then(function(a){
        return a.destroy();
      }),
      User.update({points: 0}),
      Question.update({show: false}).then(function(){
        return Question.update({show: true}, {question: 'start'});
      })
    ])
    .done(function(){
      res.sendStatus(200);
    })
    .fail(function(){
      res.sendStatus(500);
    });
  };

  return {
    User: User,
    Question: Question,
    Answer: Answer,
    activate_question: activateQuestion,
    next_question: nextQuestion,
    leaders: leaders,
    clear_leaders: clearLeaders
  };
};