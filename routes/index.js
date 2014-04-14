
var db = require('../modules/db');
var moment = require('moment');
var c = require('nconf');
var spam = require('../modules/spam');

exports.homepage = function(req, res){
  var contacted = req.query.contacted;

  db.getPosts({top3: true}, function(err, posts){

    res.render('index', {
      title: 'CSG Pro | A Team of Digital Craftsmen',
      posts: posts,
      moment: moment,
      contacted: contacted,
      cryptoTime: spam.create()
    });
  });
};
