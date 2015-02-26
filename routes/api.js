/*jsling
  node: true*/

'use strict';

var posts		= require('./api/posts'),
    users       = require('./api/users'),
    topics      = require('./api/topics'),
    jobs        = require('./api/jobs');

module.exports.posts = posts;
module.exports.users = users;
module.exports.topics = topics;
module.exports.jobs = jobs;
