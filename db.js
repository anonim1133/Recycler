var pg = require('pg');

module.exports.check = function(name, where, hash, ret){
	pg.connect(global.config.PG_CONNECTION_STRING, function(err, client, done) {
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		
		client.query('INSERT INTO image_duplicates("where", "original", "hash") VALUES ($1, $2, $3::bit(1024))', [where, name, hash], function(err) {
			if(err != null){
				console.log("DB Error: \n" + err);
				if(err.code === '23505')
					ret({status: "duplicate"})// Get that duplicate
				else
					ret({status: "error"});
			}else{
				//Returning an array of similar results
				console.log('[DEBUG] Searching for similar images');
				client.query('SELECT original, "where", similarity($1, hash) as similar FROM image_duplicates WHERE hash != $1 ORDER BY similarity($1, hash) DESC LIMIT 3;', [hash], function(err, result) {
					if(err != null){
						console.log("DB Error: \n" + err);
						ret({status: "error"});
					}else{
						ret({status: "new", result: result.rows});
					}
				});
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
