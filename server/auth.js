var passport = require('passport'),
    uuid     = require('node-uuid'),
    LocalStrategy = require('passport-local').Strategy;

var user_cache = {};

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
            res.json(model.attributes);
          }).catch(function(err) {
            console.log(err);
            res.status(500).send(err);
          });
        }
    });
  }

  function authenicate(req, res, next) {
    var token = req.headers
    new models.User({token:token).fetch().then(function(model) {
        if (model) {
          user_cache[]
          return res.json(model.attributes);
        } else {
          return res.status(401, "Invalid token");
        }
    });
  }

  return {
    register: register
  }
}
