
/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')
  , routes = require('./routes')
  , http = require('http')
  , stylus = require('stylus')
  , nib = require('nib')
  , path = require('path')
  , passport = require('passport')
  , TwitterStrategy  = require('passport-twitter').Strategy
  , c = require('nconf');

// Load the configuration file with our keys in it
c.file({ file: 'config.json'});

var TWITTER_CONSUMER_KEY = c.get('TWITTER_CONSUMER_KEY ') 
  , TWITTER_CONSUMER_SECRET = c.get('TWITTER_CONSUMER_SECRET ');

var app = express();


/**********************************
 * SETTINGS
 **********************************/
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(stylus.middleware({ // stylus CSS preprocessor
  src: __dirname + '/public'
, compile: compile
}));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Compile function for stylus
function compile(str, path){
  return stylus(str)
    .set('filename', path)
    .use(nib()); // Use nib for vendor-prefixing
}

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


/**********************************
 * ROUTES
 **********************************/
app.get('/', routes.index);

// Start server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
