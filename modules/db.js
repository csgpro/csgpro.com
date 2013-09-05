'use strict';

var https = require('https')
  , c = require('nconf');

// Load config files
c.env().file({ file: 'config.json'});

var options = {
  hostname: 'csgblogs.azure-mobile.net'
, port: 443
, headers: {
    'X-ZUMO-APPLICATION': c.get('AZURE_MOBILE_SERVICES_APPLICATION_KEY')
  }
};


/**
 * Calls back once the user has been looked up from the azure mobile service.
 * @param  {object}   profile  The twitter profile returned by the Twitter API
 * @param  {Function} callback The callback function once we are done
 */
module.exports.getUserFromProfile = function (profile, callback) {
  // console.log('Getting user: ', profile, options); // DEBUG

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
        callback(null, r[0]);
      } else {
        callback(new Error('Error querying Azure Mobile Services'));
      }
    });
  });
}

/**
 * Takes a user ID, looks it up on the azure mobile service API, and returns
 *   the user object back through the callback
 * @param  {int}   userId   A user ID that is stored in the Azure mobile service
 * @param  {Function} callback Calls back with an error or the user object
 */
module.exports.deserializeUser = function (userId, callback){
  // console.log('Deserializing userId: ', userId); // DEBUG

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
 * @param  {object}   opts     Contains TBD options
 * @param  {Function} callback Callback with the array of posts
 */
exports.getPosts = function (opts, callback) {

  options.path = '/tables/posts';

  https.get(options, function(res){
    var chunk = '';

    res.on('data', function(data){
      chunk += data;
    });

    res.on('end', function(){
      if (isJSON(chunk))
        var r = JSON.parse(chunk);

      if (r) { // posts found
        callback(null, r);
      } else {
        callback(new Error('Error querying posts from Azure Mobile Services'));
      }
    });
  })
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


/**
 * Creates a new post and puts it into the database over AMS
 * @param  {object}   post     An object containing all the necessary post fields
 * @param  {Function} callback Calls back with new posts's ID or an error
 */
exports.createPost = function(post, callback) {

  var json = JSON.stringify(post);

  options.path = '/tables/posts';
  options.method = 'POST';
  options.headers['Content-Type'] = 'application/json';
  options.headers['Content-Length'] = json.length;

  var req = https.request(options, function(res){
    // console.log('STATUS: ' + res.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(res.headers));
    var data = '';

    res.setEncoding('utf8');

    res.on('data', function(chunk) {
      data += chunk;
    });

    res.on('end', function () {
      var newPost = JSON.parse(data);
      console.dir(newPost);

      if (newPost.id) {
        callback(null, newPost.id);
      } else {
        callback(new Error('Problem creating the new post.'));
      }
    });
  });

  req.write(json);
  req.end();

};


/**********************************
 * HELPERS
 **********************************/
function twitterize(str){
  return "'@" + str + "'";
}


function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}



// Test

// module.exports.createPost({
//     Title: "Manually Injected Post"
//   , AuthorId: 1
//   , IsPublished: false
//   , Topics: "Application Development"
//   , Category: "Blog"
//   , Markdown: "# Header"
//   }, function(error, success){
//     console.log(error, success);

//   });
