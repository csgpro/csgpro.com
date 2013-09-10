var tap = require('tap')
  , test = tap.test
  , db = require('../modules/db.js')
  , toString = Object.prototype.toString;

test('Integration test ~ Real Azure Mobile Services READ web calls', function(t) {

  t.test('getPosts with no options', function(t) {
    db.getPosts(null, function(err, result) {
      t.notOk(err, 'look for an error');
      t.ok(result.length > 0, 'result has a length');
      t.ok(toString.call(result) === '[object Array]', 'result is an array');
      t.ok(result[0].hasOwnProperty('Markdown'), 'result has Markdown field');

      t.end();
    });
  });

  t.test('getPosts with top3 option', function(t) {
    var options = { top3: true };
    db.getPosts(options, function(err, result){
      t.notOk(err, 'look for an error');
      t.ok(result.length > 0, 'result has a length');
      t.ok(toString.call(result) === '[object Array]', 'result is an array');
      t.ok(result[0].hasOwnProperty('Markdown'), 'result has Markdown field');
      t.ok(result.length <= 3, 'make sure we only got the top 3 posts');
      
      t.end();
    });
  });

  t.test('getPosts with categorizedTop6 option', function(t) {
    var options = { categorizedTop6: true };
    db.getPosts(options, function(err, result){
      t.notOk(err, 'look for an error');
      t.ok(result.length > 0, 'result has a length');
      t.ok(toString.call(result) === '[object Array]', 'result is an array');
      t.ok(result[0].hasOwnProperty('name'), 'result has name field');
      t.ok(result.length <= 3, 'result has at most three categories');
      result.forEach(function(item){
        t.ok(item.posts.length <= 6, 'each category has at most six posts');
      });
      
      t.end();
    });
  });

  // t.test('createPost', function(t) {
  //   var post = {
  //     Title: 'Unit Test Created Post'
  //   , AuthorUserId: 1
  //   , ApproverUserId: 1
  //   , Topics: 'SharePoint,Web,Mobile'
  //   , Category: 'News'
  //   , Markdown: '# Sample post\r\nCreated by your neighborhood friendly **unit test**.'
  //   , Abstract: 'A sample post created by your neighborhood friendly unit test'
  //   };

  //   db.createPost(post, function(err, newPostId) {
  //     t.notOk(err, 'check for an error');
  //     t.type(newPostId, 'number', 'function returned the new post id');

  //     t.end();
  //   });
  // });

  t.test('getUsers', function(t) {
    db.getUsers(function(err, result) {
      t.notOk(err, 'look for an error');
      debugger;
      t.ok(result.length > 0, 'result has a length'); // assume there are some users
      t.ok(toString.call(result) === '[object Array]', 'result is an array');
      t.ok(result[0].hasOwnProperty('id'), 'result has an id field');
      t.ok(result[0].hasOwnProperty('Username'), 'result has a Username field');

      t.end();
    });
  });


  t.end();
});