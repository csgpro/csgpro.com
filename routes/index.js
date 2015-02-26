/*jslint
  node: true*/

'use strict';

var self = this,
    db = require('../modules/db2'),
    ht = require('../modules/hiringthing'),
    moment = require('moment'),
    c = require('nconf'),
    spam = require('../modules/spam'),
    helpers = require('../modules/helpers');

self.homepage = function(req, res){
    var contacted = req.query.contacted;

    db.getFilteredCollection('allposts', function(err, data) {

        var posts = helpers.getPublishedPosts(data);

        ht.getJobs(null, function(err, data) {

            var visiblePosts = [];

            var blogPosts = helpers.getLatestXByProp(posts, 'PublishDate', { Category: 'Blog' }, 3),
                newsArticles = helpers.getLatestXByProp(posts, 'PublishDate', { Category: 'News' }, 1),
                careerListings = helpers.getLatestXByProp(data, 'PublishDate', { Category: 'Career' }, 1);

            if (blogPosts.length) {
                for (var i = 0; i < blogPosts.length; i++) {
                    blogPosts[i].BaseUrl = '/post';
                    blogPosts[i].CategoryLink = '/post/category/Blog';
                    visiblePosts.push(blogPosts[i]);
                }
            }

            if (newsArticles.length) {
                visiblePosts.pop();
                newsArticles[0].BaseUrl = '/post';
                newsArticles[0].CategoryLink = '/post/category/News';
                visiblePosts.push(newsArticles[0]);
            }

            if (careerListings.length) {
                if (newsArticles.length) {
                    visiblePosts.splice(1, 1);
                } else {
                    visiblePosts.pop();
                }
                careerListings[0].BaseUrl = '/jobs';
                careerListings[0].CategoryLink = '/jobs';
                visiblePosts.push(careerListings[0]);
            }

            res.render('index', {
                title: 'CSG Pro | A Team of Digital Craftsmen',
                posts: visiblePosts,
                moment: moment,
                contacted: contacted,
                cryptoTime: spam.create()
            });
        });
    });
};

module.exports.homepage = self.homepage;
