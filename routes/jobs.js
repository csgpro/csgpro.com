/*jslint
node: true*/

'use strict';

var self = this,
    ht			= require('../modules/hiringthing'),
    moment      = require('moment'),
    md          = require('marked'),
    _			= require('lodash');

self.getJobs = function (req, res) {
    var search = req.query || null;
    var filter = null;
    if (search) {
        for (var prop in search) {
            if (search.hasOwnProperty(prop)) {
                if (search[prop] === true || search[prop] === 'true') {
                    filter = prop;
                } else {
                    filter = search;
                }
            }
        }
    }
    ht.getJobs(filter, function (err, data) {
        if (!err) {
            var jobs = [];

            if (data && data.length > 0) {
                jobs = data;
            }

            res.render('post-list', {
                title: 'Careers',
                moment: moment,
                category: 'Careers',
                posts: jobs,
                pageClass: 'updates'
            });
        }
    });
};

self.getJobByID = function (req, res) {
    var id = req.params.id;
    ht.getJobs(id, function (err, data) {
        if (!err) {
            var job = data[0];

            res.render('post', {
                post: job,
                marked: md,
                moment: moment,
                pageClass: 'updates'
            });
        }
    });
};
