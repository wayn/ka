var mongoose   = require('mongoose');
var Ka         = mongoose.model('Ka');
var restify    = require('restify');
var formidable = require('formidable');
var fs         = require('fs');

module.exports = function (app) {

	function postKa(req, res, next) {

		var filename = new Date().getTime() + req.files.ka.name;
		fs.renameSync(req.files.ka.path, __dirname + "/../public/" + filename);

		var ka = new Ka(req.params);
		ka.ka = filename;
		ka.save(function (err, ka) {
			if (!err) {
				res.send(ka);
			} else {
				return next(err);
			}
		});
	}

	function getKa(req, res, next) {
		if (req.params.id) {
			Ka.findById(req.params.id, function (err, ka) {
				if (!err) {
					res.send(ka);
					return next();
				} else {
					return next(new restify.InternalError(err));
				}
			});
		} else {
			return next(new restify.MissingParameterError('ObjectId required.'));
		}
	}

	function getKas(req, res, next) {
		Ka.find().sort({_id: -1}).exec(function(err, kas) {
			if (!err) {
				res.send(kas);
			} else {
				return next(new restify.InternalError(err));
			}
		});
	}

	app.post('/api/v1/ka', postKa);
	app.get('/api/v1/ka/:id', getKa);
	app.get('/api/v1/kas', getKas);
}