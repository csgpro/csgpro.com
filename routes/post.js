var db = require('../modules/db')
  , marked = require('marked')
  , moment = require('moment')
  , sanitize = require('validator').sanitize;

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
      // The pluralization of the career should be changed in this context
      if (category && category.toLowerCase() === 'career')
        category = 'Careers'

      res.render('post-list', {
        title: category,
        moment: moment,
        category: category,
        posts: posts
      });
    }
  });

};

module.exports.topic = function(req, res) {
  var topic = req.params.topic;
  topic = sanitize(topic).xss().trim();

  db.getPostsByTopic(topic, function(err, posts){
    if (err) {
      res.send(err);
    } else {
      posts = posts.filter(function(i) {
        return parseInt(i.PublishDate, 10) > 0;
      });

      res.render('post-list', {
        title: 'Topics',
        moment: moment,
        topic: topic,
        posts: posts
      });
    }
  });

};

module.exports.get = function(req, res) {
  var postId = req.params.id;

  db.getFlatPost(postId, function(err, post){
    if (post) {
      if (post.Topics)
        post.Topics = post.Topics.split(',');

      res.render('post', {
        post: post,
        marked: marked,
        moment: moment
      });
    } else {
      res.send(404);
    }
  });
};

module.exports.index = function(req, res) {
  if (req.query.q) {
    var searchInput = sanitize(req.query.q).xss().trim();
    var regex = new RegExp(searchInput, 'gi');

    db.getPosts(null, function(err, posts){
      if (err) {
        res.send(err);
      } else {
        // make sure posts are published, and match a query
        posts = posts.filter(function(i){
          var a = parseInt(i.PublishDate, 10) > 0;
          var b = regex.test(i.Markdown);
          var c = regex.test(JSON.stringify(i.Categories || ''));
          var d = regex.test(i.Title);

          return a && ( b || c || d );
        });

        res.render('post-list', {
          title: 'Search',
          moment: moment,
          searchResult: posts,
          searchInput: searchInput
        });
      }
    });

  } else {
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
  }


};
