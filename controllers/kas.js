
/**
 * Module dependencies.
 */

var mongoose   = require('mongoose');
var Ka         = mongoose.model('Ka');
var User = mongoose.model('User');
var restify    = require('restify');
var fs         = require('fs');

module.exports = function (app) {

	/**
	* Create a new ka model, fill it up and save it to Mongodb
	*
	* @param request
	* @param response
	* @param next method
	*/
	function postKa(req, res, next) {

		var filename = new Date().getTime() + req.files.ka.name;
		fs.renameSync(req.files.ka.path, __dirname + "/../public/" + filename);

		User.findById(req.params.creator, function(err, user) {
			if (err) { return next(err); }

			var ka = new Ka(req.params);
			ka.ka = filename;
			ka.save(function (err, ka) {
				if (err) { return next(err); } 

				user.kas.push(ka);
				user.save();
				res.send(ka);
			});
		});
	}

	/**
	* Search for one ka
	* 
	* @param request
	* @param response
	* @param next method
	*/
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

	/**
	* Search for all kas
	* 
	* @param request
	* @param response
	* @param next method
	*/
	function getKas(req, res, next) {
		Ka.find().sort({_id: -1}).populate('creator').exec(function(err, kas) {
			if (!err) {
				res.send(kas);
			} else {
				return next(new restify.InternalError(err));
			}
		});
	}

	// Set up routes
	/**
	* Ceate a ka
	*
	* @param path
	* @param promised callback
	*/
	app.post('/api/v1/ka', postKa);

	/**
	* Search for one ka
	*
	* @param path
	* @param promised callback
	*/
	app.get('/api/v1/ka/:id', getKa);

	/**
	* Search for all ka
	*
	* @param path
	* @param pnromised callback
	*/
	app.get('/api/v1/kas', getKas);
}