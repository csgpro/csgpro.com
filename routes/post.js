/*jslint
  node: true*/

'use strict';

var self = this,
    db = require('../modules/db2'),
    ht = require('../modules/hiringthing'),
    md = require('marked'),
    moment = require('moment'),
    _ = require('lodash'),
    sanitize = require('validator').sanitize,
    helpers = require('../modules/helpers');

md.setOptions({
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    langPrefix: 'lang-'
});

self.getPostsByCategory = function(req, res) {
    var category = req.params.category;

    db.getFilteredCollection('allposts', function(err, data) {
        if (err) {
            res.send(err);
        } else {
            data = helpers.getCollectionByKeyVal(data, { Category: category });
            // The pluralization of the career should be changed in this context
            if (category && category === 'Career') {
                category = 'Careers';
            }
            res.render('post-list', {
                title: category,
                moment: moment,
                category: category,
                posts: helpers.getPublishedPosts(data),
                pageClass: 'updates'
            });
        }
    });

};

self.getPostsByTopic = function(req, res) {
    var topic = sanitize(req.params.topic).xss().trim();

    db.getFilteredCollection('allposts/?topic=' + topic, function(err, data) {
        if (err) {
            var msg = {
                status: 'fail',
                message: 'Error Retrieving Posts',
                error: err
            };
            res.send(JSON.stringify(msg));
        } else {
            res.render('post-list', {
                title: 'Topics',
                moment: moment,
                topic: topic,
                posts: helpers.getPublishedPosts(data),
                pageClass: 'updates'
            });
        }
    });
};

self.getPostByID = function(req, res) {
    db.getFilteredCollection('allposts/?id=' + req.params.id, function(err, data) {
        if (data) {
            data = data[0];
            if (data.Topics) {
                data.Topics = data.Topics.split(','); // convert string to array
            }

            res.render('post', {
                post: data,
                marked: md,
                moment: moment,
                pageClass: 'updates'
            });
        } else {
            res.render('404');
        }
    });
};

self.getPostsBySearch = function(req, res) {
    if (req.query.q) {
        var searchInput = sanitize(req.query.q).xss().trim();
        var regex = new RegExp(searchInput, 'gi');

        db.getFilteredCollection('allposts', function(err, data){
            if (err) {
                res.send(err);
            } else {
                var posts = helpers.getPublishedPosts(data);
                ht.getJobs(null, function (err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        var postData = _.extend(posts, data);
                        var results;
                        // make sure posts are published, and match a query
                        results = postData.filter(function(i){
                            var a = parseInt(i.PublishDate, 10) > 0;
                            var b = regex.test(i.Markdown);
                            var c = regex.test(JSON.stringify(i.Categories || ''));
                            var d = regex.test(i.Title);
                            var e = regex.test(i.AuthorFullName);

                            return a && ( b || c || d  || e);
                        });

                        res.render('post-list', {
                            title: 'Search',
                            moment: moment,
                            searchResult: results,
                            searchInput: searchInput,
                            pageClass: 'updates'
                        });
                    }
                });
            }
        });

    } else {
        db.getFilteredCollection('allposts', function(err, data) {
            if (err) {
                res.send(err);
            } else {
                var posts = helpers.getPublishedPosts(data);
                ht.getJobs(null, function (err, data) {
                    if (err) {
                        res.send(err);
                    } else {
                        var postData = _.extend(posts, data);
                        var newData = [],
                            blogPosts = helpers.getLatestXByProp(postData, 'PublishDate', { Category: 'Blog' }, 6),
                            newsArticles = helpers.getLatestXByProp(postData, 'PublishDate', { Category: 'News' }, 6),
                            careerListings = helpers.getLatestXByProp(data, 'PublishDate', { Category: 'Career' }, 6);

                        if (blogPosts) {
                            newData.push({ name: 'Blog', id: 'Blog', posts: blogPosts });
                        }
                        if (newsArticles) {
                            newData.push({ name: 'News', id: 'News',  posts: newsArticles });
                        }
                        if (careerListings) {
                            newData.push({ name: 'Careers', id: 'Career', posts: careerListings });
                        }

                        res.render('post-list', {
                            title: 'All Posts',
                            moment: moment,
                            categories: newData,
                            pageClass: 'updates'
                        });
                    }
                });
            }
        });
    }
};

module.exports.getPostsByCategory = self.getPostsByCategory;
module.exports.getPostsByTopic = self.getPostsByTopic;
module.exports.getPostByID = self.getPostByID;
module.exports.getPostsBySearch = self.getPostsBySearch;
