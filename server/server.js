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
app.use(express.static(path.join(__dirname, './pages')));


notifier(bookshelf,
  {
    'questions': function(question_id) {
      new models.Question({id:question_id})
      .fetch()
      .then(function(question) {
        console.log("Question updated: ", question_id);
        question.answer_index = null;
        io.emit('questions', JSON.stringify(question));
      });
    }
  }
)

function save_answer(answer, res, callback) {
  new models.Question({id: answer.question_id}).fetch().then(function(q) {
    if (q.attributes.answer_index == answer.answer_index) {
      new models.Answer({question_id: answer.question_id}).fetchAll().then(function(collection) {
        if (collection.length > 0) {
          // soneone already answered this question
        } else {
          callback(answer); 
        }
      });
    } else {
      res.send(500, 'Incorrect');
      console.log("ERROR!! ", answer);
    }
  });
}

app.use('/register', auth.register);
app.use('/resource', restful(models.Question, 'questions'));
app.use('/resource', restful(models.Answer, 'answers', {pre_save: save_answer}));

app.set('port', process.env.PORT || 5000);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

io.on('connection', function(socket){
  console.log('a user connected');
});


