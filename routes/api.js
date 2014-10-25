/*jsling
  node: true*/

'use strict';

var posts		= require('./api/posts'),
    users       = require('./api/users');

module.exports.posts = posts;
module.exports.users = users;
