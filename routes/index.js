/*jslint
  node: true*/

'use strict';

var self = this,
    db = require('../modules/db2'),
    moment = require('moment'),
    c = require('nconf'),
    spam = require('../modules/spam'),
    helpers = require('../modules/helpers');

self.homepage = function(req, res){
    var contacted = req.query.contacted;

    db.getFilteredCollection('allposts', function(err, data) {

        data = helpers.getPublishedPosts(data);
        var blogPosts = helpers.getLatestXByProp(data, 'PublishDate', { Category: 'Blog' }, 1),
            newsArticles = helpers.getLatestXByProp(data, 'PublishDate', { Category: 'News' }, 1),
            careerListings = helpers.getLatestXByProp(data, 'PublishDate', { Category: 'Career' }, 1);

        res.render('index', {
            title: 'CSG Pro | A Team of Digital Craftsmen',
                posts: [blogPosts[0], newsArticles[0], careerListings[0]],
                moment: moment,
                contacted: contacted,
                cryptoTime: spam.create()
            });
    });
};

module.exports.homepage = self.homepage;
