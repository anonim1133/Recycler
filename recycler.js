var fs = require('fs');
var url = require('url');
var http = require('http');
var lwip = require('lwip');

var db = require('./db');

module.exports.download = function(file_url, ret) {
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
				ret(file_name);
			});
    });
    
};

module.exports.hashImage = function(file_name, ret){
	lwip.open(global.config.DOWNLOAD_DIR + '/' + file_name, function(err, image){
		image.resize(32, 32, function(err, image){
			var hash = '';
				for(var x = 0; x < 32; x++)
					for(var y = 0; y < 32; y++){
						var pixel = image.getPixel(y,x);
						if((pixel.r + pixel.g + pixel.b) > 382)
							hash += '1';
						else
							hash += '0';
					}
						
			ret(hash);
		});
	});
	fs.unlink(global.config.DOWNLOAD_DIR + '/' + file_name);
};


