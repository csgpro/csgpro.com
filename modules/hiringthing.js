/*jslint
node: true */

'use strict';

var self = this;

var request = require('request'),
    c = require('nconf'),
    _ = require('lodash');

// Load config files
c.env().file({ file: 'config.json' });

var HT_KEY = c.get('HIRINGTHING_KEY'),
    HT_PASS = c.get('HIRINGTHING_PASS'),
    HT_URL = c.get('HIRINGTHING_URL');

var options = {
    auth: {
        user: HT_KEY,
        password: HT_PASS
    },
    json: true
};

var url = 'https://' + HT_URL;

/************
* GET
***********/
self.getJobs = function (filter, callback) {
    if (Number(filter)) {
        options.uri = url + '/jobs/' + filter;
    } else {
        options.uri = url + '/jobs/active_visible';
    }

    options.method = null;

    request.get(options, function(err, response, data){
        if(err) {
            callback(err);
        } else if (response.statusCode === 404) {
            callback(); // No jobs found
        } else if (data.length) {

            for (var i = 0; i < data.length; i++) {
                data[i].PublishDate = data[i].created_at;
                data[i].Category = 'Career';
                data[i].Title = 'Open Position: ' + data[i].title;
                data[i].AuthorFullName = 'CSG Pro';
                data[i].Abstract = data[i].abstract;
                data[i].Markdown = data[i].description;
            }

            if (filter && !Number(filter)) {
                data = _.where(data, filter);
            }

            callback(null, data);
        } else {
            callback(new Error('Error retrieving data.'));
        }
    });
};

/************
* EXPORT
***********/
module.exports.getJobs = self.getJobs;

/************
* HELPERS
***********/
