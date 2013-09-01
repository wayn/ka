var restify = require("restify");
var mongoose = require('mongoose');
var fs = require('fs');

// Start server
var app = restify.createServer({
	name: 'Ka App'
});

// Database
mongoose.connect('mongodb://localhost:27017/ka');

// Restify plugins
app.use(restify.acceptParser(app.acceptable));
app.use(restify.dateParser());
app.use(restify.queryParser());
app.use(restify.jsonp());
app.use(restify.gzipResponse());
app.use(restify.bodyParser());

// Views for test
app.pre(function(req, res, next) {
  if (req.url === '/') {
     req.url = '/views';
  }
  if (req.url === '/views') {
     req.url = '/views/index.html';
  }
  return next();
});

app.get(/\/views\/?.*/, function (req, res) {
    var fileStream = fs.createReadStream(require('path').normalize(__dirname + '') + req.url);
    fileStream.on('data', function (data) {
        res.write(data);
    });
    fileStream.on('end', function() {
        res.end();
    });
});

// Models & Controllers
require("./models/ka");
require("./controllers/kas")(app);

app.listen(3000);