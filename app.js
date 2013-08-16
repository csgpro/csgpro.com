
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , stylus = require('stylus')
  , nib = require('nib')
  , path = require('path');

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
