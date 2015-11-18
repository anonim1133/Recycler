var bodyParser = require('body-parser')
var logger = require('express-logger');
var express = require('express');  
var util = require("util");

var recycler = require("./recycler");

global.config = require('./config');

var app = express();
app.use(logger({path: "logs/error.log"}));


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.post('/check/', function(req, res){
	var name = req.body.name;
	var original = req.body.original;
	var where = req.body.where;
	
	recycler.download(original, function(file_name){
		recycler.hashImage(name, where, original, file_name, function(hash){
			res.setHeader('Content-Type', 'application/json');
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.send(hash);
		});
	});	
	
	
});

//Handle 404
app.use(function(req, res, next) {
	res.status(404).send('Sorry couldn`t find that!');
});

//Handle 500
app.use(function(err, req, res, next) {
	console.log('[Debug] 500: ' + err);
	res.status(500).send('Something broke!');
});

app.listen(8888)
