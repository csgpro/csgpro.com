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

      debugger;
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
  })
};


exports.createPost = function(post, callback) {

  var json = JSON.stringify(post);

  options.path = '/tables/posts';
  options.method = 'POST';
  options.headers['Content-Type'] = 'application/json';
  options.headers['Content-Length'] = json.length;

  var req = https.request(options, function(res){
    // console.log('STATUS: ' + res.statusCode);
    // console.log('HEADERS: ' + JSON.stringify(res.headers));

    if (res.statusCode === 201 || res.statusCode === 202) {
      callback(null, true);
    } else {
      callback(new Error('Problem creating the new post.'));
    }

    res.setEncoding('utf8');

    // res.on('data', function (chunk) {
    //   console.log('BODY: ' + chunk);
    // });
  });

  req.on('error', function(error) {
    callback(new Error('Problem creating the new post.'));
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
// module.exports.serializeUser({username: 'jondelamotte'}, function(err, something){
//   console.log(err, something);
// });
// module.exports.deserializeUser(1, function(err, something){
//   console.log(err, something);
// });
