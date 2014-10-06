// See FORCE_README.md

var nforce = require('nforce'),
  config = require('./config');

var org = null;
var needs_login = true;

if (config.salesforce) {
  var org = nforce.createConnection({
    clientId: config.salesforce.clientId,
    clientSecret: config.salesforce.clientSecret,
    redirectUri: config.salesforce.redirectUri,
    environment: config.salesforce.environment, // optional, salesforce 'sandbox' or 'production', production default
    mode: 'single' // optional, 'single' or 'multi' user mode, multi default
  });
  login();
}

function login() {
  if (!org.oauth) {
    console.log("Connecting to force.com...")
    org.authenticate({
      username: config.salesforce.username,
      password: config.salesforce.password + config.salesforce.token
    }, function(err, resp) {
      // the oauth object was stored in the connection object
      if (err) {
        config.error("Force.com connection error: ", err);
      } else {
        config.info('Connected to force.com: ' + org.oauth.id);
      }
    });
  }
}

module.exports = {
  org: org,

  create_lead: function(name, email) {
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
      lead.set('Description', 'New QuizLive player');

      org.insert({
        sobject: lead
      }, function(err, resp) {
        if (!err) {
          config.info("Salesforce lead inserted: " + email);
        } else {
          config.error("Error inserting Salesforce lead: ", err);
        }
      });
    }
  },

  add_correct_answer: function(email) {
    if (org) {
      org.query({
        query: "select Id,Description from Lead where Email = '" + email + "'"
      }, function(err, resp) {
        if (!err) {
          if (resp.records && resp.records.length > 0) {
            var lead = resp.records[0];
            var cnt = parseInt(lead.get('Description'));
            if (isNaN(cnt)) {
              cnt = 0;
            }
            lead.set('Description', (cnt + 1) + ' correct answers');
            org.update({
              sobject: lead
            }, function(err, resp) {
              if (err) {
                config.error("Error updating lead ", err);
              } else {
                config.debug("Updated description on lead ", email);
              }
            });
          } else {
            config.warn("Lead not found, cannot update answer count for " + email);
          }
        }
      });
    }
  }

}