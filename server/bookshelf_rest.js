var express = require('express');

module.exports = function(model, resource) {
	var router = express.Router();
	router.get('/' + resource, function(req, res, next) {
		console.log("Params ", req.query);
		model.where(req.query).fetchAll().then(function(collection) {
			res.json(collection);
		});
	});

	router.get('/' + resource + "/:pkid", function(req, res, next) {
		var pkid = req.params.pkid;
		new model({id:pkid}).fetch().then(function(result) {
			res.json(result);
		});
	});

	return router;
}