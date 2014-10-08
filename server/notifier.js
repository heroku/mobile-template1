var pg = require('pg');
var config = require('./config');

module.exports = function(topic_callbacks) {
  pg.connect(config.db_url, function(err, client) {
    if (err) {
      console.log("Notifier, error connecting to database: " + err);
    } else {
      client.on('notification', function(msg) {
        if (topic_callbacks[msg.channel]) {
          topic_callbacks[msg.channel](msg.payload);
        }
      });
      for (var topic in topic_callbacks) {
        client.query("LISTEN " + topic);
      }
    }
  });
}