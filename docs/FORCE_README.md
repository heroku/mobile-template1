# Integration with Force.com

The [force.js](server/force.js) module shows how to use the [Nforce]([nforce](https://github.com/kevinohara80/nforce) 
package to interact with data on force.com. To use this module, you need to:

Create a Connect App with API access in Salesforce and copy down your OAuth consumer credentials.
   https://help.salesforce.com/apex/HTViewHelpDoc?id=connected_app_create.htm

Force.com access patterns: per user or named principal
This sample app is configured to access Force.com using a "named principle". This means that all
access happens through a single master user configured on the server. If you use this approach
then you don't need the Oauth redirect URI (you can use 'https://localhost/oauth/return').

The other pattern is to authenticate individual uses. In this case you will need to implement
the Saleforce oauth flow and redirect endpoint on the server and store the SF session id with 
the user record.

For our example you need a username, password, AND the security token. Visit the settings for
the user account to request the security token by email. 

Now setup the following environment variables:

    SF_OAUTH_CLIENT_ID - Oauth consumer key
    SF_OAUTH_CLIENT_SECRET - Oauth consumer secret
    SF_OAUTH_REDIRECT_URI - Oauth redirect URI. Whatever you entered into Salesforce.
    SF_USERNAME - Username of the Salesforce user
    SF_PASSWORD - Password of the Salesforce user
    SF_TOKEN - Security token for the Salesforce user
