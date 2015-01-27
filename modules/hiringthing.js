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

    request.get(options, function(err, obj, response){
        if(err) {
            callback(err);
        } else if (response !== null) {

            var aboutCsgPro = '<h3>About CSG PRO</h3>' + "\n\r";
            aboutCsgPro = aboutCsgPro + 'CSG Pro is a boutique consulting firm that has been providing custom business solutions for clients for over 20 years. We are a privately held, profitable firm that has grown up in Portland, serving mostly local clients. We are a Microsoft Gold Certified Partner specializing in BI/Analytics, Application Development, Windows Azure and SharePoint. We love what we do, and we have a lot of fun doing it.' + "\n\r\n\r";
            aboutCsgPro = aboutCsgPro + 'Located in the vibrant Pearl District, we fully enjoy being in the cultural heart of the city. The neighborhood is bike friendly with great food, shops, galleries and all the best coffee shops. We look forward to hearing from you.';

            for (var i = 0; i < response.length; i++) {
                response[i].PublishDate = response[i].created_at;
                response[i].Category = 'Career';
                response[i].Title = 'Open Position: ' + response[i].title;
                response[i].AuthorFullName = 'CSG Pro';
                response[i].Abstract = response[i].abstract;
                response[i].Markdown = response[i].description + aboutCsgPro;
            }

            if (filter && !Number(filter)) {
                response = _.where(response, filter);
            }

            callback(null, response);
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
