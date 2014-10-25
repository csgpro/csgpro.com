/*jsling
  node: true*/

'use strict';

var posts		= require('./api/posts'),
    users       = require('./api/users'),
    topics      = require('./api/topics');

module.exports.posts = posts;
module.exports.users = users;
module.exports.topics = topics;
