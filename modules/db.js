'use strict';

var https = require('https')
  , c = require('nconf');

// Load config files
c.env().file({ file: 'config.json'});

var apiKey = c.get('AZURE_MOBILE_SERVICES_APPLICATION_KEY');
var options = {
  hostname: 'csgblogs.azure-mobile.net'
, port: 443
, headers: {
    'X-ZUMO-APPLICATION': apiKey
  }
};

module.exports.serializeUser = function (user, callback){

  options.path = escape('/tables/users/?$filter=TwitterHandle eq ' + twitterize(user.username));

  // console.log('Serializing user: ', user, options); // DEBUG

  var req = https.get(options, function(res){
    var chunk = '';

    res.on('data', function(data){
      chunk += data;
    });

    res.on('end', function(){

      if (isJSON(chunk))
        var r = JSON.parse(chunk);

      if (r && r.length === 0) { // no such user
        callback(new Error('No such user'));
      } else if (r && r[0]){ // user found
        callback(null, r[0].id);
      } else {
        callback(new Error('Error querying Azure Mobile Services'));
      }
    });
  });
};

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
}

/**********************************
 * HELPERS
 **********************************/
function twitterize(string){
  return "'@" + string + "'";
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
