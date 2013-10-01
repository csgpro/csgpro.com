
var db = require('../modules/db');
var marked = require('marked');
var moment = require('moment');
var c = require('nconf');
var recaptcha = require('../modules/recaptcha');

exports.homepage = function(req, res){
  var contacted = req.query.contacted;

  db.getPosts({top3: true}, function(err, posts){
    
    // posts.forEach()

    res.render('index', {
      title: 'CSG',
      posts: posts,
      moment: moment,
      contacted: contacted,
      recaptcha_form: recaptcha.toHTML()
    });
  });
};