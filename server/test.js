var knex = require('knex')({client: 'pg', connection: 'postgresql://notexists.com/nodb' });
var bookshelf = require('bookshelf')(knex);

var User = bookshelf.Model.extend({
  tableName: 'users',
  messages: function() {
    return this.hasMany(Posts);
  }
});

var Posts = bookshelf.Model.extend({
  tableName: 'messages',
  tags: function() {
    return this.belongsToMany(Tag);
  }
});

var Tag = bookshelf.Model.extend({
  tableName: 'tags'
})

User.where('id', 1).fetch({withRelated: ['posts.tags']}).then(function(user) {

  console.log(user.related('posts').toJSON());

}).catch(function(err) {

  console.error(err);

});
