var express = require('express');  
var logger = require('express-logger');
var util = require("util");

var db = require("./recycler");

global.config = require('./config');

var app = express();
app.set('views', __dirname + '/views');
app.use(logger({path: "logs/error.log"}));

app.post('/check/', function(req, res){
	//req.params.gid
	res.send('POST');
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
