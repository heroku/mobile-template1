DEBUG = true;

exports.db_client = 'pg';
exports.db_url = process.env.DATABASE_URL || 'postgresql://localhost/quizlive';
exports.DEBUG = DEBUG;
exports.SQL_DEBUG = true;

exports.knex_options = {client: exports.db_client, connection: exports.db_url, debug: exports.SQL_DEBUG};

exports.debug = function() {
	if (DEBUG) {
		console.log("[debug] ", arguments);
	}
}

exports.warn = function() {
	console.log("[warn] ", arguments);
}

exports.error = function() {
	console.log("[error] ", arguments);
}