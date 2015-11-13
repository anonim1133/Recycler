var fs = require('fs');
var url = require('url');
var http = require('http');
var lwip = require('lwip');

var db = require('./db');

module.exports.download = function(file_url) {
	var options = {
		host: url.parse(file_url).host,
		port: 80,
		path: url.parse(file_url).pathname
	};

	var file_name = url.parse(file_url).pathname.split('/').pop();
	var file = fs.createWriteStream(global.config.DOWNLOAD_DIR + '/' + file_name);

	http.get(options, function(res) {
		res.on('data', function(data) {
				file.write(data);
			}).on('end', function() {
				file.end();
				console.log(file_name + ' downloaded to ' + global.config.DOWNLOAD_DIR);
				return(file_name);
			});
    });
};
