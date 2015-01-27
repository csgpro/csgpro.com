/*jslint
node: true*/

'use strict';

var self = this,
    ht			= require('../../modules/hiringthing'),
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
        if (err) {
            var statusCode = 400;
            var msg = {
                status: 'fail',
                message: err.error,
                error: err,
                response: data
            };
            res.status(400).send(JSON.strinify(msg));
        } else {
            var response = {
                jobs: data
            };
            res.send(response);
        }
    });
};

self.getJobByID = function (req, res) {
    var id = req.params.id;
    ht.getJobs(id, function (err, data) {
        if (err) {
            var statusCode = 400;
            var msg = {
                status: 'fail',
                message: err.error,
                error: err,
                response: data
            };
            res.status(400).send(JSON.strinify(msg));
        } else {
            var response = {
                jobs: data
            };
            res.send(response);
        }
    });
};

self.getJobsByFilter = self.getJobs;
