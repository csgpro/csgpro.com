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

            var blogPosts = helpers.getLatestXByProp(posts, 'PublishDate', { Category: 'Blog' }, 1),
            newsArticles = helpers.getLatestXByProp(posts, 'PublishDate', { Category: 'News' }, 1),
            careerListings = helpers.getLatestXByProp(data, 'PublishDate', { Category: 'Career' }, 1);

            blogPosts[0].BaseUrl = '/post';
            blogPosts[0].CategoryLink = '/post/category/Blog';
            newsArticles[0].BaseUrl = '/post';
            newsArticles[0].CategoryLink = '/post/category/News';
            careerListings[0].BaseUrl = '/jobs';
            careerListings[0].CategoryLink = '/jobs';

            res.render('index', {
                title: 'CSG Pro | A Team of Digital Craftsmen',
                posts: [blogPosts[0], newsArticles[0], careerListings[0]],
                moment: moment,
                contacted: contacted,
                cryptoTime: spam.create()
            });
        });
    });
};

module.exports.homepage = self.homepage;
