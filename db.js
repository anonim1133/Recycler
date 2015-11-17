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

module.exports.check = function(name, where, hash, ret){
	pg.connect(global.config.PG_CONNECTION_STRING, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		
		client.query('INSERT INTO image_duplicates("where", "original", "hash") VALUES ($1, $2, $3::bit(1024))', [where, name, hash], function(err, result) {
			if(err != null){
				console.log("DB Error: \n" + err);
				if(err.code === '23505')
					ret({status: "duplicate"})
				else
					ret({status: "error"});
			}else{
				ret({status: "new"})
			}
			
			done();
		});
		
	});
}


/* PLSQL Similarity function
 * 
-- Function calculates similarity
CREATE OR REPLACE FUNCTION similarity(a BIT, b BIT) RETURNS INT AS $$
BEGIN
	RETURN char_length(replace((a & b)::text, '0', '')) + char_length(replace((~a & ~b)::text, '0', '')) as similarity;
END;
$$ LANGUAGE plpgsql;
*/
