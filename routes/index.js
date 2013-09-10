var db = require('../modules/db'),
    marked = require('marked'),
    moment = require('moment');

exports.homepage = function(req, res){
  db.getPosts({top3: true}, function(err, posts){
    res.render('index', {
      title: 'CSG',
      posts: posts,
      moment: moment
    });
  });
};