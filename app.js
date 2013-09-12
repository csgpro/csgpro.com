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
  , admin            = require('./routes/admin-post')
  , adminMain        = require('./routes/admin')
  , account          = require('./routes/account')
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
if ('development' == app.get('env')) { // TODO: turn this back on
  app.use(express.errorHandler());
}


/**********************************
 * ROUTES
 **********************************/
app.get('/', index.homepage);

app.get('/post', post.index);
app.get('/post/category/:category', post.category);
app.get('/post/:id', post.get);

app.get('/admin', auth, adminMain.index);

/*****************
 * ADMIN
 ****************/
app.get('/admin/login', adminMain.login);

app.get('/admin/account'             , authAdmin , account.index);
app.post('/admin/account'            , authAdmin , account.create);
app.get('/admin/account/new'         , authAdmin , account.entry);
app.get('/admin/account/:id'         , authAdmin , account.get);
app.get('/admin/account/:id/update'  , authAdmin , account.update);
app.post('/admin/account/:id/update' , authAdmin , account.patch);
app.get('/admin/account/:id/delete'  , authAdmin , account.del);

app.get('/admin/post'               , auth      , admin.index);
app.get('/admin/post/new'           , auth      , admin.entry);
app.get('/admin/post/:id/update'    , auth      , admin.update);
app.post('/admin/post/:id/update'   , auth      , admin.create);
app.post('/admin/post'              , auth      , admin.create);
app.get('/admin/post/:id'           , auth      , admin.get);
app.get('/admin/posts'              , auth      , admin.all);
app.get('/admin/post/:id/publish'   , authAdmin , admin.publish);
app.get('/admin/post/:id/unpublish' , authAdmin , admin.unpublish);
app.get('/admin/post/:id/delete'    , authAdmin , admin.del);

app.get('/admin/notadmin', function(req, res) {
  res.send('You must be an admin to do the thing you were trying to do.');
});


/*****************
 * TWITTER
 ****************/
var error = 'Unable to authenticate with Twitter, ' +
            'or you are not authorized to use this system.';

app.get('/auth/twitter',
  passport.authenticate('twitter'),
  function(req, res){/* isnt called */}
);

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: '/login?error=' + escape(error)
  }),
  function(req, res) {
    res.redirect('/admin/post');
});


/**********************************
 * START THE SERVER, SCOTTY!
 **********************************/
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


/**********************************
 * MIDDLEWARE
 **********************************/
function auth(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/admin/login');
}

function authAdmin(req, res, next) { // They are authenticated and authorized
  if (req.isAuthenticated() && req.user.IsAdmin === true) { return next(); }
  res.redirect('/admin/notadmin');
}