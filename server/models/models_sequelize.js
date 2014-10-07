var Sequelize = require('sequelize');
var _ = require('underscore');
var Q = require('q');

module.exports = function(sequelize) {

  var timestampAttrs = {
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    updatedAt: Sequelize.DATE
  };

  var User = sequelize.define('User', _.extend({}, timestampAttrs, {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
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
    cryptedPassword: {
      type: Sequelize.STRING,
      allowNull: false
    },
    token: Sequelize.STRING,
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  }), {
    underscored: true,
    tableName: 'users'
  });

  var Question = sequelize.define('Question', _.extend({}, timestampAttrs, {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    question: Sequelize.STRING,
    answers: Sequelize.JSON,
    answerIndex: Sequelize.INTEGER,
    show: Sequelize.BOOLEAN
  }), {
    underscored: true,
    tableName: 'questions'
  });

  var Answer = sequelize.define('Answer', _.extend({}, timestampAttrs, {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    userId: Sequelize.INTEGER,
    questionId: Sequelize.INTEGER,
    answerIndex: Sequelize.INTEGER
  }), {
    underscored: true,
    tableName: 'answers'
  });

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
    return sequelize.query('UPDATE questions SET show = (id = (select min(id) from questions where show = false and id > (select max(id) from questions where show = true)))', null, {raw: true}, [id])
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
      Answer.destroy(),
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