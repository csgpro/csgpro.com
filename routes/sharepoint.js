
var db = require('../modules/db');
var moment = require('moment');
var c = require('nconf');
var spam = require('../modules/spam');

exports.content = function(req, res){
  var contacted = req.query.contacted;

  db.getPosts({top3: true}, function(err, posts){

    res.render('sharepoint', {
      title: 'CSG Pro - SharePoint Event',
      posts: posts,
      moment: moment,
      contacted: contacted,
      cryptoTime: spam.create(),
      pageClass: 'sharepoint'
    });
  });
};
