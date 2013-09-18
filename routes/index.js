var db = require('../modules/db'),
    marked = require('marked'),
    moment = require('moment');

exports.homepage = function(req, res){
  var contacted = req.query.contacted;

  db.getPosts({top3: true}, function(err, posts){
    res.render('index', {
      title: 'CSG',
      posts: posts,
      moment: moment,
      contacted: contacted
    });
  });
};