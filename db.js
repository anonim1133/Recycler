var pg = require('pg');

module.exports.query = function(query){
	pg.connect(global.config.PG_CONNECTION_STRING, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		client.query('SELECT $1::int AS number', ['1'], function(err, result) {
		
		done();
		
		if (err) {
			return console.error('error running query', err);
		}
		
		return result;
		});

	});
}

module.exports.newPlayer = function(id, name){
	pg.connect(global.config.PG_CONNECTION_STRING, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		
		client.query('INSERT INTO player values ($1, $2, 0)', [id, name], function(err, result) {	
			done();
			
			if (err) {
				if(err.code === '23505') console.log('User with that ID already exists')
				else console.error('error running query', err);
			}
		});

	});
}
