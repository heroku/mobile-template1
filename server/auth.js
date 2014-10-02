var passport = require('passport'),
    uuid     = require('node-uuid'),
    LocalStrategy = require('passport-local').Strategy;

var user_cache = {};
var register_callback = null;

module.exports = function(models) {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

  function register(req, res, next) {
    var user = req.body;

    new models.User({name:user.name}).fetch().then(function(model) {
        if (model) {
          return res.json(model.attributes);
        } else {
          user.password = 'secret';
          user.token = uuid.v4();
          new models.User(user).save().then(function(model) {
            if (register_callback) {
              register_callback(model);
            }
            res.json(model.attributes);
          }).catch(function(err) {
            console.log(err);
            res.status(500).send(err);
          });
        }
    });
  }

  function on_register(callback) {
    register_callback = callback;
  }

  function authenticate(req, res, next) {
    var token = req.headers['authorization'];
    if (token) {
      token = token.split(' ')[1];
    } else {
      token = req.query.token;
      delete req.query.token;
    }

    if (token in user_cache) {
      req.user = user_cache[token];
      next();
    } else {
      new models.User({token:token}).fetch().then(function(model) {
          if (model) {
            user_cache[token] = model;
            req.user = model;
            return next();
          } else {
            console.log("Invalid token, returning 401");
            return res.status(401).send("Invalid token");
          }
      });
    }
  }

  function clear_leaders(req, res, next) {
      user_cache = {};
      return models.clear_leaders(req, res, next);
  }


  return {
    register: register,
    on_register: on_register,
    authenticate: authenticate,
    clear_leaders: clear_leaders
  }
}
