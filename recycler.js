var fs = require('fs');
var url = require('url');
var http = require('http');
var lwip = require('lwip');

var db = require('./db');

module.exports.download = function(file_url, ret) {
	console.log('[DEBUG] Downloading');
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

module.exports.hashImage = function(name, where, original, file_name, ret){
	console.log('[DEBUG] Hashing');
	if(file_name.match(/(\.jpg|\.jpeg|png)/i)){
		lwip.open(global.config.DOWNLOAD_DIR + '/' + file_name, function(err, image){
			if(image !== null && image !== undefined){
				image.resize(32, 32, function(err, image){
					var hash = '';
					var avg = 0;
						for(var x = 0; x < 32; x++)
							for(var y = 0; y < 32; y++){
								var pixel = image.getPixel(y,x);
								avg += pixel.r + pixel.g + pixel.b;
							}
						
						avg = avg/1024;
						
						for(var x = 0; x < 32; x++)
							for(var y = 0; y < 32; y++){
								var pixel = image.getPixel(y,x);
								if((pixel.r + pixel.g + pixel.b) > avg)
									hash += '1';
								else
									hash += '0';
							}
							
					db.check(name, where, original, hash, function(result){
						ret(result);
					});
				});
			}else
				ret({status: 'error', error: err});
		});
	}else{
		console.log('[DEBUG] File seems to not be image');
	}
	fs.stat(global.config.DOWNLOAD_DIR + '/' + file_name, function(err, stat) {
		if(err == null) {
			fs.unlink(global.config.DOWNLOAD_DIR + '/' + file_name);
		}
	});
	
};


