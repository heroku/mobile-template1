var http      = require('http'),
    config    = require('./config'),
    express   = require('express'),
    passport  = require('passport')
    path      = require('path'),
    knex      = require('knex')({client: config.db_client, connection: config.db_url, debug: config.DEBUG}),
    bookshelf = require('bookshelf')(knex),
    models    = require('./models')(bookshelf),
    notifier  = require('./notifier')
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


app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, './pages')));


notifier(bookshelf,
  {
    'questions': function(question_id) {
      new models.Question({id:question_id})
      .fetch()
      .then(function(question) {
        console.log("Question updated: ", question_id);
        io.emit('questions', JSON.stringify(question));
      });
    }
  }
)

app.set('port', process.env.PORT || 5000);

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

io.on('connection', function(socket){
  console.log('a user connected');
});


