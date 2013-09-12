var db = require('../modules/db')
  , marked = require('marked')
  , moment = require('moment');

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  langPrefix: 'lang-'
});


module.exports.category = function(req, res) {
  var category = req.params.category;

  db.getPosts({ category: category}, function(err, posts) {
    if (err) {
      res.send(err);
    } else {
      res.render('post-list', {
        title: category,
        moment: moment,
        category: category,
        posts: posts
      });
    }
  });

};

module.exports.get = function(req, res) {
  var postId = req.params.id;

  db.getFlatPost(postId, function(err, post){
    res.render('post', {
      post: post,
      marked: marked,
      moment: moment
    });
  });
};

module.exports.index = function(req, res) {

  db.getPosts({ categorizedTop6: true }, function(err, categories) {
    if (err) {
      res.send(err);
    } else {
      res.render('post-list', {
        title: 'All Posts',
        moment: moment,
        categories: categories
      });
    }
  });

};
