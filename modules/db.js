/*jslint
  node: true */

'use strict';

var https = require('https')
  , c = require('nconf')
  , _ = require('lodash')
  , request = require('request'); // mixing here

// Load config files
c.env().file({ file: 'config.json'});

var appKey = c.get('AZURE_MOBILE_SERVICES_APPLICATION_KEY');

var options = {
  hostname: 'csgblogs.azure-mobile.net'
, port: 443
, headers: {
    'X-ZUMO-APPLICATION': appKey
  }
};
var url = 'https://csgblogs.azure-mobile.net';

/**
 * Gets all the users, should only be run by admins, this is validated in app.js
 * @param  {Function} callback Calls back with either an `error` or the `users`
 */
module.exports.getUsers = function (callback) {

  var o = {
    uri: url + '/tables/users'
  , headers: {
      'X-ZUMO-APPLICATION': appKey
    }
  };
  var r;

  request.get(o, function(err, httpObj, response) {

    if (err) {
      callback(err);
    } else if (response !== null) {
      if (isJSON(response)) {
        r = JSON.parse(response);
        r = r.map(function(item) {
          item.CreateDate = parseInt(item.CreateDate, 10);
          item.UpdateDate = parseInt(item.UpdateDate, 10);
          return item;
        });
        callback(null, r); // good to go!
      } else {
        callback(new Error('Invalid response when getting users.'));
      }
    } else {
      callback(new Error('Error getting users.'));
    }
  });

};


module.exports.getUser = function(userId, callback) {

  var o = {
    uri: url + '/tables/users/' + userId,
    headers: {
      'X-ZUMO-APPLICATION': appKey
    }
  };

  request.get(o, function(err, httpObj, response) {
    if (err) {
      callback(err);
    } else if (response !== null
               && !response.error
               && isJSON(response)) {
      callback(null, JSON.parse(response));
    } else {
      callback(new Error('Error getting user: ' + response.error));
    }
  });

};

module.exports.updateUser = function(user, callback) {

  var o = {
    uri: url + '/tables/users/' + user.id,
    headers: {
      'X-ZUMO-APPLICATION': appKey
    },
    json: user
  };

  request.patch(o, function(err, httpObj, response) {
    if (err) {
      callback(err);
    } else if (response !== null && !response.error) {
      callback(null, true);
    } else {
      callback(new Error('Error updating user: ' + response.error));
    }
  });

};


module.exports.createUser = function(user, callback) {

  var o = {
    uri: url + '/tables/users',
    headers: {
      'X-ZUMO-APPLICATION': appKey
    },
    json: user
  };

  request.post(o, function(err, httpObj, response) {
    if (err) {
      callback(err);
    } else if (response !== null && !response.error) {
      callback(null, true);
    } else {
      callback(new Error('Error updating user: ' + response.error));
    }
  });

};

module.exports.deleteUser = function(userId, callback){

  var o = {
    uri: url + '/tables/users/' + userId,
    headers: {
      'X-ZUMO-APPLICATION': appKey
    }
  };

  request.del(o, function(err, httpObj, response) {
    if (err) {
      callback(err);
    } else if (response !== null && !response.error) {
      callback(null, true);
    } else {
      callback(new Error('Error deleting user: ' + response.error));
    }
  });

};

/**
 * Calls back once the user has been looked up from the azure mobile service.
 * @param  {object}   profile  The twitter profile returned by the Twitter API
 * @param  {Function} callback The callback function once we are done
 */
module.exports.getUserFromTwitterProfile = function (profile, callback) {

  options.path = escape('/tables/users/?$filter=TwitterHandle eq ' + twitterize(profile.username));

  var req = https.get(options, function(res){
    var chunk = '';

    res.on('data', function(data){
      chunk += data;
    });

    res.on('end', function(){

      if (isJSON(chunk))
        var r = JSON.parse(chunk);

      if (r && r.length === 0) { // no such profile
        callback(new Error('No such profile'));
      } else if (r && r[0]){ // profile found
        var user = r[0];
        user.CreateDate = parseInt(user.CreateDate);
        user.UpdateDate = parseInt(user.UpdateDate);

        callback(null, user);
      } else {
        callback(new Error('Error querying Azure Mobile Services'));
      }
    });
  });

};

/**
 * Takes a user ID, looks it up on the azure mobile service API, and returns
 *   the user object back through the callback
 * @param  {int}   userId   A user ID that is stored in the Azure mobile service
 * @param  {Function} callback Calls back with an error or the user object
 */
module.exports.deserializeUser = function (userId, callback) {

  options.path = '/tables/users/' + userId;

  https.get(options, function(res){
    var chunk = '';

    res.on('data', function(data){
      chunk += data;
    });

    res.on('end', function(){
      if (isJSON(chunk))
        var r = JSON.parse(chunk);

      if (res.statusCode === 404) { // no such user
        callback(new Error('No such user'));
      } else if (r){ // user found
        callback(null, r);
      } else {
        callback(new Error('Error querying Azure Mobile Services'));
      }
    });
  });

};

/**
 * Returns an array of the various posts that we get from the AMS (azure mobile
 *   service)
 * @param  {object}   opts     Should either have a `top3` or `categorizedTop6`
 *                             property. These will respectively return
 *                             different results. Leave opts = `null` if you
 *                             want all the posts returned.
 * @param  {Function} callback Callback with the array of posts
 */
exports.getPosts = function (opts, callback) {

  options.path = '/api/allposts';
  var r;

  https.get(options, function(res){
    var chunk = '';

    res.on('data', function(data){
      chunk += data;
    });

    res.on('end', function(){
      if (isJSON(chunk)) {
        r = JSON.parse(chunk);
        r = r.sort(function(a, b) {
          return a.PublishDate <= b.PublishDate ? 1 : -1; // descending
        });
      }

      if (r !== undefined) { // posts found
        if (opts !== null) { // only 1st of each
                                                            // category 
          var posts = [];

          r = r.filter(function(item) {
            return item.PublishDate;
          });

          var blog = _.where(r, {Category: 'Blog'})
            , news = _.where(r, {Category: 'News'})
            , career = _.where(r, {Category: 'Career'});

          if (opts.hasOwnProperty('top3')) {

            if (blog[0])
              posts.push(blog[0]);
            if (news[0])
              posts.push(news[0]);
            if (career[0])
              posts.push(career[0]);

          } else if (opts.hasOwnProperty('categorizedTop6')) {

            blog = _.first(blog, 6);
            news = _.first(news, 6);
            career = _.first(career, 6);

            if (blog)
              posts.push({ name: 'Blog', id: 'Blog', posts: blog });
            if (news)
              posts.push({ name: 'News', id: 'News',  posts: news });
            if (career)
              posts.push({ name: 'Careers', id: 'Career', posts: career });

          } else if (opts.hasOwnProperty('category')) {

            var cat = {
              blog: blog,
              news: news,
              career: career
            };
            var lowered = opts.category.toLowerCase();

            posts = cat[lowered];
          }

          callback(null, posts);
        } else {
          callback(null, r);
        }
      } else {
        callback(new Error('Error querying posts from Azure Mobile Services'));
      }
    });
  });

};

exports.getPostsByTopic = function(topic, callback) {

  var o = {
    uri: url + "/tables/posts/?$filter=indexof(Topics, '" + topic + "') gt -1",
    headers: {
      'X-ZUMO-APPLICATION': appKey
    }
  };

  request.get(o, function(err, httpObj, response) {
    if (err) {
      callback(err);
    } else if (response !== null && response.length && isJSON(response)) {
      callback(null, JSON.parse(response));
    } else {
      callback(new Error('Error getting posts by topic.'));
    }
  });

};

/**
 * Retrieve a single post from AMS
 * @param  {int}      postId   The int id for the post
 * @param  {Function} callback Calls back with the single post
 */
exports.getPost = function (postId, callback) {

  options.path = '/tables/posts/' + postId;

  https.get(options, function(res){
    var chunk = '';

    res.on('data', function(data){
      chunk += data;
    });

    res.on('end', function(){
      if (isJSON(chunk))
        var r = JSON.parse(chunk);

      if (r) { // post found
        callback(null, r);
      } else {
        callback(new Error('Error retrieving post from Azure Mobile Services'));
      }
    });
  });

};

exports.getFlatPost = function(postId, callback) {

  options.path = '/api/allposts/?id=' + postId ;

  https.get(options, function(res){
    var chunk = '';

    res.on('data', function(data){
      chunk += data;
    });

    res.on('end', function(){
      if (isJSON(chunk))
        var r = JSON.parse(chunk);

      if (r) { // post found
        callback(null, r[0]);
      } else {
        callback(new Error('Error retrieving post from Azure Mobile Services'));
      }
    });
  });

};

exports.patchPost = function (post, callback) {

  var o = {
    uri: url + '/tables/posts/' + post.id,
    headers: {
      'X-ZUMO-APPLICATION': appKey
    },
    json: post 
  };

  request.patch(o, function(err, httpObj, response) {


    if (err || response['error']) {
      callback(err);
    } else if (response !== null && response.hasOwnProperty('id')) {
      callback(null, response.id);
    } else {
      callback(new Error('Error patching post.'));
    }
  });

};

exports.publish = function(postId, callback) {

  var o = {
    uri: url + '/tables/posts/' + postId,
    headers: {
      'X-ZUMO-APPLICATION': appKey
    },
    json: {
      PublishDate: new Date().getTime()
    }
  };

  request.patch(o, function(err, httpObj, response) {
    if (err) {
      callback(err);
    } else if (response !== null) {
      callback(null, true);
    } else {
      callback(new Error('Error creating post.'));
    }
  });

};

exports.unpublish = function(postId, callback) {

  var o = {
    uri: url + '/tables/posts/' + postId
  , headers: {
      'X-ZUMO-APPLICATION': appKey
  }
  , json: {
      PublishDate: ''
    }
  };

  request.patch(o, function(err, httpObj, response) {
    if (err) {
      callback(err);
    } else if (response !== null) {
      callback(null, true);
    } else {
      callback(new Error('Error creating post.'));
    }
  });

};

exports.del = function(postId, callback) {
  var o = {
    uri: url + '/tables/posts/' + postId,
    headers: {
      'X-ZUMO-APPLICATION': appKey
    }
  };

  request.del(o, function(err, httpObj, response) {
    if (err) {
      callback(err);
    } else if (response !== null) {
      callback(null, true);
    } else {
      callback(new Error('Error deleting post.'));
    }
  });

};

/**
 * Creates a new post and puts it into the database over AMS
 * @param  {object}   post     An object containing all the necessary post fields
 * @param  {Function} callback Calls back with new posts's ID or an error
 */
exports.createPost = function(post, callback) {

  var o = {
    uri: url + '/tables/posts'
  , headers: {
      'X-ZUMO-APPLICATION': appKey
  }
  , json: post
  };

  request.post(o, function(err, httpObj, response) {
    if (err) {
      callback(err);
    } else if (response !== null && response.hasOwnProperty('id')) {
      callback(null, response.id);
    } else {
      callback(new Error('Error creating post.'));
    }
  });

};

/**
 * Calls back once the user has been looked up from the azure mobile service.
 * @param  {object}   profile  The live profile returned by the win live API
 * @param  {Function} callback The callback function once we are done
 */
module.exports.getUserFromLiveProfile = function (profile, callback) {
  console.log('Attempt to get Live account with username: ' + profile._json.name);
  console.log('Full live profile: ');
  console.dir(profile);

  options.path = escape('/tables/users/?$filter=FullName eq ' + quotize(profile._json.name));

  var req = https.get(options, function(res){
    var chunk = '';

    res.on('data', function(data){
      chunk += data;
    });

    res.on('end', function(){

      if (isJSON(chunk))
        var r = JSON.parse(chunk);

      if (r && r.length === 0) { // no such profile
        callback(new Error('No such profile'));
      } else if (r && r[0]){ // profile found
        var user = r[0];
        user.CreateDate = parseInt(user.CreateDate);
        user.UpdateDate = parseInt(user.UpdateDate);

        callback(null, user);
      } else {
        callback(new Error('Error querying Azure Mobile Services'));
      }
    });
  });

};

module.exports.createTopic = function(topicName, callback) {

  var o = {
    uri: url + '/tables/topics',
    headers: {
      'X-ZUMO-APPLICATION': appKey
    },
    json: {Name: topicName}
  };

  request.post(o, function(err, httpObj, response) {
    console.dir(response);
    console.dir(err);
    if (err) {
      callback(err);
    } else if (response !== null && !response.error) {
      var obj = response;

      callback(null, obj.id);
    } else {
      callback(new Error('Error creating user: ' + response.error));
    }
  });

};

module.exports.deleteTopic = function(topicId, callback){

  var o = {
    uri: url + '/tables/topics/' + topicId,
    headers: {
      'X-ZUMO-APPLICATION': appKey
    }
  };

  request.del(o, function(err, httpObj, response) {
    if (err) {
      callback(err);
    } else if (response !== null && !response.error) {
      callback(null, true);
    } else {
      callback(new Error('Error deleting topic: ' + response.error));
    }
  });

};

module.exports.updateTopic = function(topicId, newName, callback) {

  var o = {
    uri: url + '/tables/topics/' + topicId,
    headers: {
      'X-ZUMO-APPLICATION': appKey
    },
    json: {
      Name: newName
    }
  };

  request.patch(o, function(err, httpObj, response) {
    if (err) {
      callback(err);
    } else if (response !== null && !response.error) {
      callback(null, true);
    } else {
      callback(new Error('Error updating topic: ' + response.error));
    }
  });

};

module.exports.getTopics = function (callback) {

  var o = {
    uri: url + '/tables/topics'
  , headers: {
      'X-ZUMO-APPLICATION': appKey
    }
  };

  request.get(o, function(err, httpObj, response) {

    if (err) {
      callback(err);
    } else if (response !== null && !response.error && isJSON(response)) {
      callback(null, JSON.parse(response));
    } else {
      callback(new Error('Error getting topics.'));
    }
  });

};



/**********************************
 * HELPERS
 **********************************/
function twitterize(str) {
  return "'@" + str + "'";
}

function quotize(str) {
  return "'" + str + "'";
}


function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


