'use strict';

/**
 * Module dependencies.
 */

var express          = require('express')
  , fs               = require('fs')
  , index            = require('./routes/index')
  , http             = require('http')
  , stylus           = require('stylus')
  , nib              = require('nib')
  , path             = require('path')
  , passport         = require('passport')
  , TwitterStrategy  = require('passport-twitter').Strategy
  , c                = require('nconf')
  , db               = require('./modules/db.js')
  , adminPost        = require('./routes/admin-post')
  , post             = require('./routes/post');

// Load the configuration file with our keys in it, first from the env variables
// then from the config.json file
c.env().file({ file: 'config.json'});

/**********************************
 * PASSPORT AUTHENTICATION
 **********************************/
var TWITTER_CONSUMER_KEY    = c.get('TWITTER_CONSUMER_KEY') 
  , TWITTER_CONSUMER_SECRET = c.get('TWITTER_CONSUMER_SECRET')
  , TWITTER_CALLBACK_URL    = c.get('TWITTER_CALLBACK_URL');

// Serialize users into sessions with just their user id
passport.serializeUser(function(user, cb){
  if (user) {
    cb(null, user.id);
  } else {
    cb(new Error('Couldnt serialize user'), null);
  }
});
passport.deserializeUser(db.deserializeUser);

// passport.deserializeUser(function(obj, done) {
//   done(null, obj);
// });

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY
  , consumerSecret: TWITTER_CONSUMER_SECRET
  , callbackURL: TWITTER_CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {

    db.getUserFromProfile(profile, function(err, user){

      if (user && user.IsAdmin === true && !err) { // TODO: allow non-admins access into the system
        return done(null, user);
      } else {
        return err ? done(err, null) : done(new Error('User not authorized'), null);
      }
    });
  }
));

var app = express();


/**********************************
 * SETTINGS
 **********************************/
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(stylus.middleware({ // stylus CSS preprocessor
  src: __dirname + '/public'
, compile: compile
}));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: "asd~~~kj~jKjjj~JJJJk123" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Compile function for stylus
function compile(str, path){
  return stylus(str)
    .set('filename', path)
    .use(nib()); // Use nib for vendor-prefixing
}

// Development only
// if ('development' == app.get('env')) { // TODO: turn this back on
  app.use(express.errorHandler());
// }


/**********************************
 * ROUTES
 **********************************/
app.get('/', index.homepage);

/*****************
 * ADMIN
 ****************/
app.get('/admin', auth, function(req, res){
  res.render('admin/index', { user: req.user });
});

app.get('/account', auth, function(req, res){
  res.render('admin/account', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('admin/login', { user: req.user });
});

app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){/* isnt called */}
);

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/admin');
});

// TODO: add authentication to each of these
app.get('/admin/post', adminPost.index);
app.get('/admin/post/new', adminPost.entry);
app.get('/admin/post/:id/update', adminPost.update);
app.post('/admin/post', adminPost.create);
app.get('/admin/post/:id', adminPost.get);
app.get('/admin/posts', adminPost.all);

app.get('/posts', post.index);

app.get('/account/json', auth, function(req, res){
  res.send(req.user);
});


// Start server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


/**********************************
 * MIDDLEWARE
 **********************************/
function auth(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}