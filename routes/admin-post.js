/*jslint
  node: true*/

'use strict';

var db = require('../modules/db')
  , fs = require('fs')
  , marked = require('marked')
  , moment = require('moment')
  , _ = require('lodash')
  , email = require('../modules/email')
  , toString = Object.prototype.toString;

var markdownHelpHtml;

fs.readFile('views/admin/docs/markdown-help.md', function(err, data){
  if (!err) {
    markdownHelpHtml = marked(data.toString());
  } else {
    console.error('Problem reading the markdown help file.');
  }
});

exports.index = function(req, res) {
  var message, type;

  if (req.query.message && req.query.type) {
    message = req.query.message;
    type = req.query.type;
  }


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
      moment: moment,
      message: message,
      type: type
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
    db.getUsers(function(err, users) {
      db.getTopics(function(err, topics){
        res.render('admin/post-create', {
          user: req.user,
          users: users,
          topics: _.pluck(topics, 'Name'),
          markdownHelpHtml: markdownHelpHtml
        });
      });
    });
  } else {
    db.getTopics(function(err, topics) {
      res.render('admin/post-create', {
        user: req.user,
        markdownHelpHtml: markdownHelpHtml,
        topics: _.pluck(topics, 'Name')
      });
    });
  }
};

exports.update = function(req, res) {
  var postId = req.params.id;

  db.getUsers(function(err, users) {
    db.getPost(postId, function(err, post){
      db.getTopics(function(err, topics){
        var dbTopics = _.pluck(topics, 'Name');
        var postTopics;

        console.dir(post); // DEBUG

        if (post.Topics)
          postTopics = post.Topics.split(',');

        var topicsUnion = _.union(dbTopics, postTopics);
        topicsUnion = topicsUnion.sort(function(a,b) {
          return a <= b ? -1 : 1;
        });

        res.render('admin/post-create', {
          user: req.user,
          users: users,
          markdownHelpHtml: markdownHelpHtml,
          topics: topicsUnion,
          postTopics: objectify(postTopics),
          moment: moment,
          post: post
        });
      });
    });
  });

};

exports.patch = function(req, res) {
  var post = req.body;

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

// Create and update
exports.create = function (req, res) {
  var b = req.body;
  var topics = '';
  var publishDate = moment(b.PublishDate, 'MM-DD-YYYY');

  console.dir(b); // DEBUG

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
    Title: b.Title,
    AuthorUserId: b.AuthorUserId || req.user.id,
    Topics: topics,
    Category: b.Category,
    Markdown: b.Markdown,
    Abstract: b.Abstract,
    PublishDate: publishDate
  };

  if (req.params.id) {
    post.id = parseInt(req.params.id, 10);

    db.patchPost(post, function(err, newPostId) {
      if (err) {
        res.send(err);
      } else if (newPostId){
        res.redirect('/post/' + newPostId);
      }
    });
  } else {
    db.createPost(post, function(err, newPostId) {
      if (newPostId) {
        res.redirect('/post/' + newPostId);
        // email admins
        db.getUsers(function(err, users) {
          var emails;

          if (err) {
            console.log('Error getting users when trying to send admin emails.');
          } else {
            users = users.filter(function(user){
              return user.IsAdmin; // send email to all admins
            });
            emails = _.pluck(users, 'Username');
            emails = emails.map(function(i) { return i + '@csgpro.com'; });
            emails = emails.join(',');

            email.sendEmail(
              emails, // to
              'New blog post submitted', // subject
              'A new post was submitted by ' // body
              + req.user.FullName + ' at ' + moment().format('LLL') + '.\r\n\r\n'
              + 'Click <a href="http://csgpro.com/post/' + newPostId
              + '">here</a> to review the post.',
              true,
              function(err, success){
                if (err) {
                  console.log(err);
                } else {
                  console.log('Emails successfully sent to ' + emails);
                }
              }
            );
          }
        });
      } else {
        res.send(err);
      }
    });
  }
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

function objectify(array) {
  var obj = {};

  if (array) {
    for (var i = array.length - 1; i >= 0; i--) {
      obj[array[i]] = true;
    }
  }

  return obj;
}