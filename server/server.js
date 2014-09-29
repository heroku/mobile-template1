var http           = require('http'),
    config         = require('./config'),
    express        = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    passport       = require('passport')
    path           = require('path'),
    knex           = require('knex')(config.knex_options),
    bookshelf      = require('bookshelf')(knex),
    models         = require('./models')(bookshelf),
    notifier       = require('./notifier'),
    restful        = require('./bookshelf_rest'),
    auth           = require('./auth')(models)
    ;

/********************* APP SETUP *****************************/

app = express();
server  = http.createServer(app);
io = require('socket.io')(server);

app.set('bookshelf', bookshelf);

logger = {
  debug: config.debug,
  warn: config.warn,
  error: config.error
};


app.use(bodyParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, '../admin')));
app.use(express.static(path.join(__dirname, './pages')));

// Logging
app.use(function(req, res, next){
  logger.debug('%s %s', req.method, req.url);
  next();
});

app.use(function(err, req, res, next) {
    logger.error(err.stack);
    res.status(500).send(err.message);
});


/********************* ROUTES *****************************/

app.use('/register', auth.register);

app.all('/resource/*', auth.authenticate);

app.use('/resource', restful(models.Question, 'questions'));
app.use('/resource', restful(models.Answer, 'answers', {pre_save: save_answer}));
app.post('/resource/questions/:questionId/activate', models.activate_question);
app.get('/resource/leaders', models.leaders);
app.delete('/resource/leaders', models.clear_leaders);

function save_answer(req, res, callback) {
  var answer = req.body;

  answer.user_id = req.user.id;

  console.log("IN save_answer, answer is ", answer);

  new models.Question({id: answer.question_id}).fetch().then(function(q) {
    if (q.attributes.answer_index == answer.answer_index) {
      models.Answer.query({select:'*'}).where({question_id: answer.question_id})
        .fetchAll().then(function(collection) {
        console.log("Found existing answers ", collection);
        if (collection.length > 0) {
          console.log("Result collection is > 0");
          // soneone already answered this question
          res.send('OK');
        } else {
          console.log("Result collection is 0");
          callback(answer); 
          // Tell everyone the question is answered
          io.emit('answer', JSON.stringify({user: req.user, question_id: answer.question_id}));
        }
      });
    } else {
      res.send(500, 'Incorrect');
      console.log("ERROR!! ", answer);
    }
  });
}

/********************* NOTIFICATIONS *****************************/


notifier(bookshelf,
  {
    'questions': function(question_id) {
      new models.Question({id:question_id})
      .fetch()
      .then(function(question) {
        question = question.attributes;
        question.answer_index = null;
        console.log("Loaded question ", question);
        if (question.show) {
          console.log("Sending next question: ", question);
          io.emit('questions', JSON.stringify(question));
        }
      });
    }
  }
)

/********************* SERVER STARTT *****************************/


app.set('port', process.env.PORT || 5000);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

io.on('connection', function(socket){
  console.log('a user connected');
});


