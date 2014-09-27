var pg = require('pg');

var knex = require('knex')({
  //dialect: 'sqlite3',
  //dialect: 'pg',
  client: 'pg',
  connection: 'postgresql://localhost/muchado',
  debug: true
});

/*
// Create a table
knex.schema.dropTable('accounts')

.then(function() {
	return knex.schema.dropTable('users')
}).

then(function() {
  return knex.schema.createTable('users', function(table) {
	  table.increments('id');
	  table.string('user_name');
   });
})

// ...and another
.then(function() {
  return knex.schema.createTable('accounts', function(table) {
	  table.increments('id');
	  table.string('account_name');
	  table.integer('user_id').unsigned().references('users.id');
	});
})

// Then query the table...
.then(function() {
  return knex.insert({user_name: 'Tim'}).into('users');
})

// ...and using the insert id, insert into the other table.
.then(function(rows) {
  return knex.table('accounts').insert({account_name: 'knex', user_id: rows[0]});
})

// Query both of the rows.
.then(function() {
  knex('users')
    .select('*').then(function(results) {
    	console.log("Results ", results);
    }).catch(function(err) {
    	console.log("Error ", err);
    })
});
*/

pg.connect(knex.client.connectionSettings, function(err, client) {
    if (err) {
        console.log("Error connecting to database: " + err);
    } else {
        client.on('notification', function(msg) {
            console.log("DATABASE NOTIFY: ", msg);
            // Move some data...
        });
        var query = client.query("LISTEN questions");
    }
});
