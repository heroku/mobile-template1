var http           = require('http'),
    config         = require('./server/config'),
    express        = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    path           = require('path'),
    knex           = require('knex')(config.knex_options),
    models         = require('./server/models'),
    notifier       = require('./server/notifier'),
    restful        = require('./server/restful'),
    auth           = require('./server/auth')(models),
    force          = require('./server/force')
    ;

/********************* APP SETUP *****************************/

app = express();
server = http.createServer(app);
io = require('socket.io')(server);

logger = {
  debug: config.debug,
  warn: config.warn,
  error: config.error
};


app.use(bodyParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'client/')));
app.use(express.static(path.join(__dirname, 'admin/')));
app.use(express.static(path.join(__dirname, 'server/pages')));

// Logging
app.use(function(req, res, next) {
  logger.debug(req.method, req.url);
  next();
});

app.use(function(err, req, res, next) {
  logger.error(err.stack);
  res.status(500).send(err.message);
});


/********************* ROUTES *****************************/

app.use('/register', auth.register);
app.use('/login', auth.login);

app.all('/resource/*', auth.authenticate);

app.use('/resource', restful(models.Question, 'questions'));
app.use('/resource', restful(models.Answer, 'answers', {
  pre_save: save_answer
}));
app.post('/resource/questions/:questionId/activate', models.activate_question);
app.post('/resource/questions/:questionId/next', models.next_question);
app.get('/resource/leaders', models.leaders);
app.delete('/resource/leaders', auth.clear_leaders);

function save_answer(req, res, callback) {
  var answer = req.body;

  answer.user_id = req.user.id;

  models.Question.objects.getById(answer.question_id).then(function(q) {
    if (q.answer_index == answer.answer_index) {
      io.emit('_every_answer', JSON.stringify({
        user: req.user,
        correct: true
      }));
      force.add_correct_answer(req.user.email);

      models.Answer.objects.query(null, {question_id: answer.question_id}).then(function(collection) {
        if (collection.length > 0) {
          // soneone already answered this question
          models.User.objects.incrementPoints(req.user.id, 2).then(function(){
            res.send('OK');
          });
        }
        else {
          // first to answer correct
          models.User.objects.incrementPoints(req.user.id, 5).then(function(){
            callback(answer);

            // Tell everyone the question is answered
            var theAnswer = '';
            try {
              theAnswer = q.answers[q.answer_index - 1];
            } catch (e) {}
            io.emit('answer', JSON.stringify({
              user: req.user,
              question_id: answer.question_id,
              answer: theAnswer
            }));
          }).catch(function(){
            res.sendStatus(500);
          });
        }
      });
    } else {
      io.emit('_every_answer', JSON.stringify({
        user: req.user,
        correct: false
      }));
      res.status(500).json(q);
    }
  }).catch(function(){
    res.sendStatus(500);
  });
}

/********************* NOTIFICATIONS *****************************/

auth.on_register(function(user) {
  force.create_lead(user.name, user.email);
});

notifier({
  'questions': function(question_id) {
    models.Question.objects.getById(question_id)
    .then(function(question) {
      if (question.show) {
        question.answer_index = null;
        question.question_index = 0;
        question.question_total = 10;
        io.emit('questions', JSON.stringify(question));
      }
    });
  }
})

/********************* SERVER STARTT *****************************/


app.set('port', process.env.PORT || 5000);

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

io.on('connection', function(socket) {
  console.log('a user connected');
});