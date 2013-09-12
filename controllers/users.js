
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var User     = mongoose.model('User');
var restify  = require('restify');
var fs       = require('fs');

module.exports = function (app) {

	/**
	* Create a new user model, fill it up and save it to Mongodb
	*
	* @param request
	* @param response
	* @param next method
	*/
	function postUser(req, res, next) {

		if (req.files.avator) {
			// get avator ext
			var avatorName = req.files.avator.name;
			console.log(req.params);
			var i = avatorName.lastIndexOf('.');
			var ext = (i < 0) ? '' : avatorName.substr(i);
			var avatorNewName = req.params.username + ext;
			// rename and store user avator
			fs.renameSync(req.files.avator.path, __dirname + "/../public/" + avatorNewName);
		} else {
			var avatorNewName = "default.jpg";
		}
		
		var user = new User(req.params);

		user.avator = avatorNewName;
		if (user.username != null && user.username != '') {
			user.save(function (err, user) {
				console.log(user);
				if (!err) {
					res.send(user);
				} else {
					return next(err);
				}
			});
		} else {
			return next(new restify.MissingParameterError('Username required.'));
		}
	}

	/**
	* Search for all users
	* 
	* @param request
	* @param response
	* @param next method
	*/
	function getUsers(req, res, next) {
		User.find().sort({_id: -1}).exec(function(err, users) {
			if (!err) {
				res.send(users);
			} else {
				return next(new restify.InternalError(err));
			}
		});
	}

	/**
	* Search for existing username
	* 
	* @param request
	* @param response
	* @param next method
	*/
	function checkUsername(req, res, next) {

		if (req.params.username != null && req.params.username != '') {
			var query = User.where( 'username', new RegExp('^'+req.params.username+'$', 'i') );
			query.count(function(err, count) {
				if (!err) {
					if (count === 0) {
						res.send({});
						return next();
					} else {
						return next(new restify.InternalError('Username already in use.'));
					}
				} else {
					return next(new restify.InternalError(err));
				}
			});
		} else {
			return next(new restify.MissingParameterError('Username required.'));
		}
	}

	/**
	* User logs in use username
	* @param  request
	* @param  reponse
	* @param  next method
	*/
	function login(req, res, next) {

		var query = User.where( 'username', new RegExp('^'+req.params.username+'$', 'i') );
		query.findOne(function (err, user) {

			if (err) {
				res.send(err);
				return next();
			} else if (!user) {
				return next(new restify.NotAuthorizedError("Invalid username."));
				return next();
			} else if (user.authenticate(req.params.password)) {
				res.send(user);
				return next();
			} else {
				return next(new restify.NotAuthorizedError("Invalid password."));
			}
		});
	}

	// Set up routes
	/**
	* Create a user
	*
	* @param path
	* @param promised callback
	*/
	app.post('/api/v1/user', postUser);

	/**
	* Search for all user
	*
	* @param path
	* @param pnromised callback
	*/
	app.get('/api/v1/users', getUsers);

	/**
	* Search for username
	*
	* @param path
	* @param promised callback
	*/
	app.get('/api/v1/user/username/exists', checkUsername);

	/**
	* Login request
	*
	* @param path
	* @param pnromised callback
	*/
	app.post('/api/v1/user/login', login);
}