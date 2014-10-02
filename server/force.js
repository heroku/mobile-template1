// This module shows how to use the Nforce package to interact with data on force.com
// The use this module, you need to:
//
// Create a Connect App with API access in Salesforce and copy down your OAuth consumer credentials.
//   https://help.salesforce.com/apex/HTViewHelpDoc?id=connected_app_create.htm
//
// Force.com access patterns: per user or named principal
//
// This sample app is configured to access Force.com using a "named principle". This means that all
// access happens through a single master user configured on the server. If you use this approach
// then you don't need the Oauth redirect URI (you can use 'https://localhost/oauth/return').
//
// The other pattern is to authenticate individual uses. In this case you will need to implement
// the Saleforce oauth flow and redirect endpoint on the server and store the SF session id with 
// the user record.
//
// For our example you need a username, password, AND the security token. Visit the settings for
// the user account to request the security token by email. 
//
// Now setup the following environment variables:
// SF_OAUTH_CLIENT_ID - Oauth consumer key
// SF_OAUTH_CLIENT_SECRET - Oauth consumer secret
// SF_REDIRECT_URI - Oauth redirect URI. Whatever you entered into Salesforce.
// SF_USERNAME - Username of the Salesforce user
// SF_PASSWWORD - Password of the Salesforce user
// SF_TOKEN - Security token for the Salesforce user

var nforce = require('nforce'),
    config = require('./config')
    ;

var org = null;
var needs_login = true;

if (config.salesforce) {
	var org = nforce.createConnection({
	  clientId: config.salesforce.clientId,
	  clientSecret: config.salesforce.clientSecret,
	  redirectUri: config.salesforce.redirectUri,
	  environment: config.salesforce.environment,  // optional, salesforce 'sandbox' or 'production', production default
	  mode: 'single' // optional, 'single' or 'multi' user mode, multi default
	});	
	login();
}

function login() {
	if (!org.oauth) {
		console.log("Connecting to force.com...")
		org.authenticate({ username: config.salesforce.username, 
			               password: config.salesforce.password + config.salesforce.token}, function(err, resp){
		  // the oauth object was stored in the connection object
		  if(err) {
		  	condfig.error("Force.com connection error: ", err);
		  } else {
		  	config.info('Connected to force.com: ' + org.oauth.id);
		  }
		});
	}
}

module.exports = {
	org: org,

	create_lead : function(name, email) {
		if (org) {
			if (name.split(" ").length > 1) {
				name = name.split(" ");
			} else {
				name = [name, name];
			}

			var lead = nforce.createSObject('Lead');
			lead.set('FirstName', name[0]);
			lead.set('LastName', name[1]);
			lead.set('Company', 'quizlive');
			lead.set('Email', email);

			org.insert({ sobject: lead }, function(err, resp){
				if (!err) {
					config.info("Salesforce lead inserted: " + email);
				} else {
					config.error("Error inserting Salesforce lead: ", err);
				}
			});
		}
	}
}
