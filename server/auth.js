var bcrypt = require('bcrypt'),
  uuid = require('node-uuid'),
  validator = require('validator');

var user_cache = {};
var register_callback = null;

function encryptPassword(password, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return callback(err);
    }
    bcrypt.hash(password, salt, function(err, hash) {
      return callback(err, hash);
    });
  });
}

function comparePassword(password, hash, callback) {
  console.log("Comparing ", password, " to hash ", hash);
  bcrypt.compare(password, hash, function(err, match) {
    if (err) {
      return callback(err);
    } else {
      return callback(null, match);
    }
  });
}

module.exports = function(models) {
  function clean_user(user) {
    delete user['crypted_password'];
    return user;
  }

  function register(req, res, next) {
    var user = req.body;

    if (!validator.isEmail(user.email)) {
      return res.status(400).send("Invalid email address");
    }
    if (!validator.isLength(user.name, 3)) {
      return res.status(400).send("Name must be at least 3 characters");
    }
    if (!validator.isLength(user.password, 3)) {
      return res.status(400).send("Password must be at least 3 characters");
    }

    console.log("Registering ", user);
    models.User.objects.getByEmail(user.email).then(function(model) {
      if (model) {
        return next(Error("That email is already registered"));
      } else {
        encryptPassword(user.password, function(err, hash) {
          if (err) return next(err);

          user.token = uuid.v4();
          user.crypted_password = hash;

          delete user['password'];
          delete user['password2'];

          models.User.objects.create(user).then(function(model) {
            if (register_callback) {
              register_callback(model);
            }
            res.json(clean_user(model));
          }).catch(next);
        });
      }
    });
  }

  function login(req, res, next) {
    var user = req.body;

    models.User.objects.getByEmail(user.email).then(function(model) {
      if (!model) {
        return res.status(401).send("Invalid credentials");
      }

      console.log("Compare user ", user, " to model ", model);

      comparePassword(user.password, model.crypted_password, function(err, match) {
        if (err) {
          console.log(err);
          return res.status(401).send("Invalid Credentials");
        }
        if (match) {
          models.User.objects.update(model.id, {token: uuid.v4()}).then(function(model) {
            console.log('USER MODEL RESPONSE =', model);
            res.json(clean_user(model));
          }).catch(next);

        } else {
          // Passwords don't match
          return res.status(401).send("Invalid Credentials");
        }
      });
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
      models.User.objects.getByToken(token).then(function(model) {
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
    login: login,
    on_register: on_register,
    authenticate: authenticate,
    clear_leaders: clear_leaders
  }
}