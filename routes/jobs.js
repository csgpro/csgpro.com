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

            var aboutCsgPro = '<h3>About CSG PRO</h3>' + "\n\r";
            aboutCsgPro = aboutCsgPro + 'CSG Pro is a boutique consulting firm that has been providing custom business solutions for clients for over 20 years. We are a privately held, profitable firm that has grown up in Portland, serving mostly local clients. We are a Microsoft Gold Certified Partner specializing in BI/Analytics, Application Development, Windows Azure and SharePoint. We love what we do, and we have a lot of fun doing it.' + "\n\r\n\r";
            aboutCsgPro = aboutCsgPro + 'Located in the vibrant Pearl District, we fully enjoy being in the cultural heart of the city. The neighborhood is bike friendly with great food, shops, galleries and all the best coffee shops. We look forward to hearing from you.';

            job.Markdown = job.Markdown + aboutCsgPro;

            res.render('post', {
                post: job,
                marked: md,
                moment: moment,
                pageClass: 'updates'
            });
        }
    });
};
