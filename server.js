var bodyParser = require('body-parser')
var logger = require('express-logger');
var express = require('express');  
var util = require("util");

var recycler = require("./recycler");

global.config = require('./config');

var app = express();
app.set('views', __dirname + '/views');
app.use(logger({path: "logs/error.log"}));


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.post('/check/', function(req, res){
	var name = req.body.url;
	var url = req.body.url;
	
	recycler.download(url);
	
	
	res.send(req.body.url);
});

//Handle 404
app.use(function(req, res, next) {
  res.status(404).send('Sorry couldn`t find that!');
});

//Handle 500
app.use(function(err, req, res, next) {
  res.status(500).send('<pre>Something broke!<br>'+err.stack+'</pre>');
});

app.listen(8888)
