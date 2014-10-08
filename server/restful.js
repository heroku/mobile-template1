var express = require('express');
var _ = require('underscore');

module.exports = function(model, resource, options) {
  options = options || {};

  var router = express.Router();
  router.get('/' + resource, function(req, res, next) {
    var select = null;
    if (req.query.select) {
      select = req.query.select;
      delete req.query.select
    }

    for (var key in req.query) {
      if (req.query[key] === 'true') {
        req.query[key] = true;
      }
      else if (req.query[key] === 'false') {
        req.query[key] = false;
      }
    }

    return model.objects.query(select, req.query).then(function(collection) {
      res.json(collection);
    });
  });

  router.get('/' + resource + "/:pkid", function(req, res, next) {
    var pkid = req.params.pkid;
    model.objects.getById(pkid).then(function(result) {
      res.json(result);
    });
  });

  function save_item(item, res) {
    model.objects.create(item).then(function(row) {
      res.json(row);
    }).catch(function(err) {
      console.log(err);
      res.status(500).send(err);
    });
  }

  router.post('/' + resource, function(req, res, next) {
    if (options.pre_save) {
      options.pre_save(req, res, function(item) {
        save_item(item, res);
      });
    } else {
      save_item(req.body, res);
    }
  })
  return router;
}