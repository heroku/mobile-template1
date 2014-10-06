DEBUG = true;

exports.db_client = 'pg';
exports.db_url = process.env.DATABASE_URL || 'postgresql://localhost/quizlive';
exports.DEBUG = DEBUG;
exports.SQL_DEBUG = false;

exports.knex_options = {
  client: exports.db_client,
  connection: exports.db_url,
  debug: exports.SQL_DEBUG
};

if (process.env.SF_OAUTH_CLIENT_ID) {
  salesforce = {
    username: process.env.SF_USERNAME,
    password: process.env.SF_PASSWORD,
    token: process.env.SF_TOKEN,
    clientId: process.env.SF_OAUTH_CLIENT_ID,
    clientSecret: process.env.SF_OAUTH_CLIENT_SECRET,
    redirectUri: process.env.SF_OAUTH_REDIRECT_URI,
    environment: 'production'
  }
  for (var k in salesforce) {
    if (!salesforce[k]) {
      console.log("[warn] config var " + k + " is not set. Force.com connection may fail.");
    }
  }
} else {
  salesforce = null;
}

exports.salesforce = salesforce;

exports.debug = function() {
  if (DEBUG) {
    console.log.apply(console, ["[debug]"].concat(Array.prototype.slice.call(arguments, 0)));
  }
}

exports.info = function() {
  if (DEBUG) {
    console.log.apply(console, ["[info]"].concat(Array.prototype.slice.call(arguments, 0)));
  }
}

exports.warn = function() {
  console.log.apply(console, ["[WARN]"].concat(Array.prototype.slice.call(arguments, 0)));
}

exports.error = function() {
  console.log.apply(console, ["[ERROR]"].concat(Array.prototype.slice.call(arguments, 0)));
}