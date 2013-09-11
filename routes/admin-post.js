var db = require('../modules/db')
  , filters = require('../modules/filters') // TODO: clean up, not used right now
  , moment = require('moment')
  , toString = Object.prototype.toString;


exports.index = function(req, res) {

  db.getPosts(null, function(err, posts){
    posts = posts.sort(function(a,b) {
      return a.id < b.id ? -1 : 1; // descending
    });

    if (!req.user.IsAdmin) { // if they are not an admin, show only their posts
      posts = posts.filter(function(item) {
        return item.AuthorUserId === req.user.id ? true : false;
      });
    }

    res.render('admin/post-list', {
      user: req.user,
      posts: posts,
      moment: moment
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
  if (req.user.IsAdmin) {
    db.getUsers(function(err, users){
      res.render('admin/post-create', {
        user: req.user,
        users: users
      });
    });
  } else {
    res.render('admin/post-create', {
      user: req.user
    });
  }
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

exports.del = function(req, res) {
  var postId = req.params.id;

  db.del(postId, function(err, result) {
    if (err) {
      res.send(err);
    } else if (result){
      res.redirect('/admin/post');
    }
  });

};

exports.create = function (req, res) {
  var b = req.body;
  var topics = '';
  var publishDate = moment(b.PublishDate, 'MM-DD-YYYY');

  console.log(b.Topics + " |date| " + b.PublishDate); // DEBUG

  if (isArray(b.Topics)) {
    topics = b.Topics.join(',');
  } else {
    topics = b.Topics;
  }

  if (publishDate && publishDate.isValid()) {
    publishDate = publishDate._d.getTime();
  } else {
    publishDate = undefined;
  }

  var post = {
    Title: b.Title
  , AuthorUserId: b.AuthorUserId || req.user.id
  , Topics: topics
  , Category: b.Category
  , Markdown: b.Markdown
  , Abstract: b.Abstract
  , PublishDate: publishDate
  };

  db.createPost(post, function(err, newPostId) {
    if (newPostId) {
      res.redirect('/post/' + newPostId);
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


function isArray(input) {
  return Object.prototype.toString.call(input) === '[object Array]' ? true : false;
}