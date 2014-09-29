var express = require('express');

module.exports = function(model, resource, options) {
	var router = express.Router();
	router.get('/' + resource, function(req, res, next) {
		console.log("Params ", req.query);
		var select = '*';
		if (req.query.select) {
			select = req.query.select;
			delete req.query['select'];
		}
		model.query({select:select}).where(req.query).fetchAll().then(function(collection) {
			res.json(collection);
		});
	});

	router.get('/' + resource + "/:pkid", function(req, res, next) {
		var pkid = req.params.pkid;
		new model({id:pkid}).fetchOne().then(function(result) {
			res.json(result);
		});
	});

	function save_item(item, res) {
		new model(item).save().then(function(row) {
			res.json(row);
		}).catch(function(err) {
			res.send(500, err);
		});
	}

	router.post('/' + resource, function(req, res, next) {
		if (options.pre_save) {
			options.pre_save(req.body, res, function(item) {
				save_item(item, res);
			});
		} else {
			save_item(req.body, res);
		}
	})
	return router;
}