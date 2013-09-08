var db = require('../modules/db')
  , filters = require('../modules/filters') // TODO: clean up, not used right now
  , moment = require('moment');


exports.index = function(req, res) {

  db.getPosts(null, function(err, posts){
    res.render('admin/post-list', {
      user: req.user
    , posts: posts
    , filters: filters
    , moment: moment
    });
  });
};

exports.publish = function(req, res) {
  db.publish(req.params.id, function(err, result) {
    if (err) {
      res.send(err);
    } else if (result){
      res.redirect('/admin/post');
    }
  });
};

exports.unpublish = function(req, res) {
  db.unpublish(req.params.id, function(err, result) {
    if (err) {
      res.send(err);
    } else if (result){
      res.redirect('/admin/post');
    }
  });
};

exports.all = function (req, res) {
  db.getPosts(null, function(err, posts){
    res.send(posts);
  });
};

exports.entry = function (req, res) {
  res.render('admin/post-create', {
    user: req.user
  });
};

exports.update = function(req, res) {
  var postId = req.params.id;

  db.getPost(postId, function(err, post){
    res.render('admin/post-create', {
      user: req.user
    , post: post
    });
  });
};

exports.create = function (req, res) {
  var b = req.body;
  var post = {
    Title: b.Title
  , AuthorUserId: req.user.id
  , IsPublished: false
  , Topics: typeof b.Topics === 'string' ? b.Topics : b.Topics.join(',')
  , Category: b.Category
  , Markdown: b.Markdown
  , Abstract: b.Abstract
  };

  db.createPost(post, function(err, newPostId) {
    if (newPostId) {
      res.redirect('/admin/post/' + newPostId);
      // res.send('Post added! id: ' + newPostId);
    } else {
      res.send(err);
    }
  });
};

exports.get = function (req, res) {
  var postId = req.params.id;

  db.getPost(postId, function(err, post){
    res.render('admin/post', {
      user: req.user
    , post: post
    });
  });
};